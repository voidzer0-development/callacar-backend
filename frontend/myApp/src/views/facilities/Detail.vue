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

    <ion-content :fullscreen="true" v-if="facility">
      <div class="ion-padding">
        <h3>{{ facility.name }}</h3>
        <h4>Details</h4>
        <ul>
          <li>
            Price: €{{ Number.parseFloat(facility.price).toFixed(2) }} per day
          </li>
          <li>
            Dependencies:
            <ul>
              <li v-for="utility in facility.dependencies" :key="utility.id">
                {{ utility.name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <ion-button :disabled="showEdit" @click="showEdit = true"
        >Edit</ion-button
      >
      <ion-button color="danger" @click="handleDelete">Delete</ion-button>

      <div class="ion-padding" v-show="showEdit">
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
          <ion-select multiple="true" v-model="facility.plainDeps">
            <ion-select-option
              v-for="utility in utilities"
              :key="utility.id"
              :value="utility.id"
              >{{ utility.name }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <ion-button color="light" @click="showEdit = false">
          Cancel
        </ion-button>
        <ion-button :disabled="disableEdit" @click="handleEdit">
          Save
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  alertController,
} from "@ionic/vue";

import { useRoute, useRouter } from "vue-router";
import { defineComponent } from "vue";

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

      disableEdit: false,
      showEdit: false,

      facility: null,
      utilities: null,
    };
  },
  async mounted() {
    const route = useRoute();

    const facResponse = await FacilityService.getFacility(route.params.id);
    this.facility = facResponse.data;

    const utilResponse = await UtilityService.getUtilities();
    this.utilities = utilResponse.data;

    const dep = this.facility.dependencies;
    if ((dep?.length || 0) > 0 && typeof dep[0] !== "string")
      this.facility.plainDeps = dep.map((util) => util.id);

    this.loading = false;
  },
  methods: {
    handleEdit: async function () {
      if (this.disableEdit) return;

      const data = {
        name: this.facility.name,
        price: Number.parseFloat(this.facility.price) || 0,
        dependencies: this.facility.plainDeps,
      };

      console.log(data);

      try {
        this.disableEdit = true;
        await FacilityService.editFacility(this.facility.id, data);
        this.router.go();
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Updating failed",
          message: `Something went wrong trying to update this facility: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableEdit = false;
      }
    },
    handleDelete: async function () {
      const facility = this.facility;
      const router = this.router;

      const alert = await alertController.create({
        header: "Are you sure?",
        message: `Are you sure you want to delete ${facility.name}? This action cannot be undone.`,
        buttons: [
          {
            text: "No",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: async function () {
              await FacilityService.deleteFacility(facility.id);
              router.push("/tabs/facilities");
            },
          },
        ],
      });

      return alert.present();
    },
  },
  components: {
    IonBackButton,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
