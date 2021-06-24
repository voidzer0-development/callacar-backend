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
        <ion-title>Facility</ion-title>
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
              v-model="facility.name"
              id="facility_name"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label position="floating">Price</ion-label>
            <ion-input
              type="number"
              step=".01"
              class="form-control"
              v-model="facility.price"
              id="facility_price"
              required
            />
          </ion-item>

          <ion-item>
            <ion-label>Dependencies</ion-label>
            <ion-select multiple="true" v-model="facility.dependencies">
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

import { FacilityService } from "@/services/facility.service";
import { UtilityService } from "@/services/utility.service";

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

      facility: {
        name: null,
        price: null,
        dependencies: null,
      },
      utilities: null,
    };
  },
  async mounted() {
    const utilResponse = await UtilityService.getUtilities();
    this.utilities = utilResponse.data;

    this.loading = false;
  },
  methods: {
    async handleCreate() {
      if (this.disableSubmit) return;

      const data = {
        name: this.facility.name,
        price: Number.parseFloat(this.facility.price) || 0,
        dependencies: this.facility.dependencies,
      };

      try {
        this.disableSubmit = true;
        await FacilityService.createFacility(data);
        this.router.push("/tabs/facilities");
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this facility: ${
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
