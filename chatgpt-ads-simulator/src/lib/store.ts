"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { enrichDraftWithCreativeImages } from "./draft-enrichment";
import {
  DEMO_BRAND,
  createInitialCampaign,
  loadPrebakedDraft,
} from "./demo-data";
import {
  addAdToGroup,
  removeAdFromGroup,
  updateAdGroupHints as patchAdGroupHints,
  updateAdInGroup,
} from "./draft-mutations";
import type {
  AdDraft,
  BrandProfile,
  CampaignDraft,
  ContextHintDraft,
  DemoUser,
  PlatformCampaign,
  UIResults,
} from "./types";

interface AppState {
  isAuthenticated: boolean;
  user: DemoUser | null;
  brand: BrandProfile;
  campaigns: PlatformCampaign[];

  signIn: (user: DemoUser) => void;
  signOut: () => void;
  initializeWorkspace: () => Promise<void>;

  addCampaign: (campaign: PlatformCampaign) => void;
  updateCampaign: (
    id: string,
    updater: (c: PlatformCampaign) => PlatformCampaign,
  ) => void;
  getCampaign: (id: string) => PlatformCampaign | undefined;
  setCampaignDraft: (id: string, draft: CampaignDraft) => void;
  updateCampaignDraft: (
    id: string,
    updater: (draft: CampaignDraft) => CampaignDraft,
  ) => void;
  updateAdGroupHints: (
    id: string,
    adGroupId: string,
    hints: ContextHintDraft[],
  ) => void;
  addAd: (id: string, adGroupId: string, ad?: AdDraft) => void;
  removeAd: (id: string, adGroupId: string, adId: string) => void;
  updateAd: (
    id: string,
    adGroupId: string,
    adId: string,
    patch: Partial<AdDraft>,
  ) => void;
  setCampaignResults: (id: string, results: UIResults) => void;
  launchCampaign: (id: string, openaiCampaignId: string) => void;
  activateCampaign: (id: string) => void;
  applyRecommendation: (id: string, recommendation: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      brand: DEMO_BRAND,
      campaigns: [],

      signIn: (user) => {
        set({
          isAuthenticated: true,
          user,
          brand: DEMO_BRAND,
        });
      },

      signOut: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      initializeWorkspace: async () => {
        if (get().campaigns.length > 0) {
          set((state) => ({
            campaigns: state.campaigns.map((campaign) => ({
              ...campaign,
              draft: enrichDraftWithCreativeImages(campaign.draft),
            })),
          }));
          return;
        }

        const draft = enrichDraftWithCreativeImages(await loadPrebakedDraft());
        set({
          brand: DEMO_BRAND,
          campaigns: [createInitialCampaign(draft)],
        });
      },

      addCampaign: (campaign) => {
        set((state) => ({ campaigns: [...state.campaigns, campaign] }));
      },

      updateCampaign: (id, updater) => {
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? updater(c) : c,
          ),
        }));
      },

      getCampaign: (id) => get().campaigns.find((c) => c.id === id),

      setCampaignDraft: (id, draft) => {
        get().updateCampaign(id, (c) => ({
          ...c,
          draft,
          name: draft.campaign.name,
          status: c.status === "simulated" ? "simulated" : "draft",
        }));
      },

      updateCampaignDraft: (id, updater) => {
        get().updateCampaign(id, (c) => {
          const draft = updater(structuredClone(c.draft));
          return {
            ...c,
            draft,
            name: draft.campaign.name,
          };
        });
      },

      updateAdGroupHints: (id, adGroupId, hints) => {
        get().updateCampaignDraft(id, (draft) =>
          patchAdGroupHints(draft, adGroupId, hints),
        );
      },

      addAd: (id, adGroupId, ad) => {
        get().updateCampaignDraft(id, (draft) =>
          addAdToGroup(draft, adGroupId, ad),
        );
      },

      removeAd: (id, adGroupId, adId) => {
        get().updateCampaignDraft(id, (draft) =>
          removeAdFromGroup(draft, adGroupId, adId),
        );
      },

      updateAd: (id, adGroupId, adId, patch) => {
        get().updateCampaignDraft(id, (draft) =>
          updateAdInGroup(draft, adGroupId, adId, patch),
        );
      },

      setCampaignResults: (id, results) => {
        get().updateCampaign(id, (c) => ({
          ...c,
          lastResults: results,
          status: "simulated",
          simulatedAt: new Date().toISOString(),
        }));
      },

      launchCampaign: (id, openaiCampaignId) => {
        get().updateCampaign(id, (c) => ({
          ...c,
          status: "pending_review",
          openaiCampaignId,
          submittedAt: new Date().toISOString(),
        }));

        setTimeout(() => {
          const campaign = get().getCampaign(id);
          if (campaign?.status === "pending_review") {
            get().activateCampaign(id);
          }
        }, 60_000);
      },

      activateCampaign: (id) => {
        get().updateCampaign(id, (c) => ({
          ...c,
          status: "active",
          activatedAt: new Date().toISOString(),
        }));
      },

      applyRecommendation: (id, recommendation) => {
        get().updateCampaign(id, (c) => {
          const draft = structuredClone(c.draft);
          const lower = recommendation.toLowerCase();

          if (lower.includes("drop") || lower.includes("pause hint")) {
            const dropHints = [
              "best gen z skincare brands",
              "skincare for hyperpigmentation under $50",
              "holiday skincare gift sets under $40",
            ];
            for (const group of draft.ad_groups) {
              group.context_hints = group.context_hints.filter(
                (h) => !dropHints.some((d) => h.text.toLowerCase().includes(d)),
              );
            }
          }

          if (lower.includes("replace ad 3") || lower.includes("ad 3")) {
            const group = draft.ad_groups[0];
            if (group?.ads[2]) {
              group.ads[2].title = "Gentle actives, $12";
              group.ads[2].description =
                "Science-backed formulas teens actually use.";
            }
          }

          return {
            ...c,
            draft,
            lastResults: c.lastResults
              ? {
                  ...c.lastResults,
                  recommendations: c.lastResults.recommendations.filter(
                    (r) => r !== recommendation,
                  ),
                }
              : undefined,
          };
        });
      },
    }),
    {
      name: "adlab-store",
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as {
          isAuthenticated?: boolean;
          user?: DemoUser | null;
          brand?: BrandProfile;
          campaigns?: PlatformCampaign[];
        };

        if (version < 1 && state.campaigns?.length) {
          state.campaigns = state.campaigns.map((campaign) => ({
            ...campaign,
            draft: enrichDraftWithCreativeImages(campaign.draft),
          }));
        }

        return state as AppState;
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        brand: state.brand,
        campaigns: state.campaigns,
      }),
    },
  ),
);

export { DEMO_CAMPAIGN_ID } from "./demo-data";
