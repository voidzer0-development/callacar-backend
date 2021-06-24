<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            :text="getBackButtonText()"
            default-href="/"
          ></ion-back-button>
        </ion-buttons>
        <ion-title>Site</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.prevent="handleCreate">
        <div class="ion-padding">
          <ion-item>
            <ion-label position="floating">Name</ion-label>
            <ion-input
              type="text"
              class="form-control"
              v-model="site.name"
              id="site_name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label>Accomodation</ion-label>
            <ion-select v-model="site.accomodation">
              <ion-select-option
                v-for="accomodation in accomodations"
                :key="accomodation.id"
                :value="accomodation.id"
                >{{ accomodation.name }}</ion-select-option
              >
            </ion-select>
          </ion-item>

          <ion-button type="submit" :disabled="disableSubmit">
            Create
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  alertController,
} from "@ionic/vue";

import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import { SiteService } from "@/services/site.service";
import { AccomodationService } from "@/services/accomodation.service";

export default defineComponent({
  name: "Detail",
  data() {
    return {
      getBackButtonText: () => {
        const mode = window && window.Ionic && window.Ionic.mode;
        return mode === "ios" ? "Back" : "";
      },
      loading: true,

      disableSubmit: false,

      site: {
        name: null,
        price: null,
        accomodation: null,
      },
      accomodations: null,
    };
  },
  async mounted() {
    const accResponse = await AccomodationService.getAccomodations();
    this.accomodations = accResponse.data;

    this.loading = false;
  },
  methods: {
    async handleCreate() {
      if (this.disableSubmit) return;

      const data = {
        name: this.site.name,
        accomodation: this.site.accomodation,
      };

      try {
        this.disableSubmit = true;
        await SiteService.createSite(data);
        this.router.push("/tabs/sites");
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this site: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableSubmit = false;
      }
    },
  },
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
