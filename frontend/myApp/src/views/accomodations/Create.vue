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
        <ion-title>Accomodation</ion-title>
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
              v-model="accomodation.name"
              id="accomodation_name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Type</ion-label>
            <ion-select
              placeholder="Select a type..."
              v-model="accomodation.type"
              interface="popover"
              required
            >
              <ion-select-option value="S">Standaard</ion-select-option>
              <ion-select-option value="C">Comfort</ion-select-option>
              <ion-select-option value="T">Trekker</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="floating">Area</ion-label>
            <ion-input
              type="number"
              step=".01"
              class="form-control"
              v-model="accomodation.area"
              id="accomodation_area"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Price per Day</ion-label>
            <ion-input
              type="number"
              step=".01"
              class="form-control"
              v-model="accomodation.daily_price"
              id="accomodation_daily_price"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Price per Season</ion-label>
            <ion-input
              type="number"
              step=".01"
              class="form-control"
              v-model="accomodation.season_price"
              id="accomodation_season_price"
            />
          </ion-item>

          <ion-item>
            <ion-label>Utilities</ion-label>
            <ion-select
              multiple="true"
              v-model="accomodation.utilities"
              :disabled="utilitiesLoading"
            >
              <ion-select-option
                v-for="utility in utilities"
                :key="utility.id"
                :value="utility.id"
                >{{ utility.name }}</ion-select-option
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

import { AccomodationService } from "@/services/accomodation.service";
import { UtilityService } from "@/services/utility.service";

export default defineComponent({
  name: "Detail",
  data() {
    return {
      getBackButtonText: () => {
        const mode = window && window.Ionic && window.Ionic.mode;
        return mode === "ios" ? "Back" : "";
      },
      disableSubmit: false,
      utilitiesLoading: true,
      utilities: null,
      accomodation: {
        name: null,
        type: null,
        area: null,
        daily_price: null,
        season_price: null,
        utilities: [],
      },
    };
  },
  async mounted() {
    const response = await UtilityService.getUtilities();
    this.utilities = response.data;
    this.utilitiesLoading = false;
  },
  methods: {
    async handleCreate() {
      if (this.disableSubmit) return;

      if (!this.accomodation.type) {
        const errorAlert = await alertController.create({
          header: "Type is required",
          message: "Please select a type for this accomodation.",
          buttons: ["OK"],
        });
        return errorAlert.present();
      }

      const data = {
        name: this.accomodation.name,
        type: this.accomodation.type,
        area: Number.parseFloat(this.accomodation.area) || 0,
        daily_price: Number.parseFloat(this.accomodation.daily_price) || 0,
        season_price: Number.parseFloat(this.accomodation.season_price) || 0,
        utilities: this.accomodation.utilities,
      };

      try {
        this.disableSubmit = true;
        await AccomodationService.createAccomodation(data);
        this.router.push("/tabs/accomodations");
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this accomodation: ${
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
    IonSelect,
    IonSelectOption,
    IonItem,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
