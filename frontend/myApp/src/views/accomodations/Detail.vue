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

    <ion-content :fullscreen="true" v-if="accomodation">
      <div class="ion-padding">
        <h3>{{ accomodation.name }}</h3>
        <h4>Details</h4>
        <ul>
          <li><strong>Area:</strong> {{ accomodation.area.toFixed(1) }} m²</li>
          <li>
            <strong>Daily Price:</strong> €{{
              accomodation.daily_price.toFixed(2)
            }}
          </li>
          <li v-if="accomodation.season_price > 0">
            <strong>Season Price:</strong> €{{
              accomodation.season_price.toFixed(2)
            }}
          </li>
          <li><strong>Utilities:</strong></li>
          <ol>
            <li v-for="utility in accomodation.utilities" :key="utility.id">
              {{ utility.name }}
            </li>
          </ol>
        </ul>
      </div>

      <div v-show="is_admin">
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
              v-model="accomodation.plainUtils"
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

          <ion-button color="light" @click="showEdit = false">
            Cancel
          </ion-button>
          <ion-button :disabled="disableEdit" @click="handleEdit">
            Save
          </ion-button>
        </div>
      </div>
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

import { useRoute, useRouter } from "vue-router";
import { defineComponent } from "vue";

import { AuthService } from "@/services/auth.service";
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
      disableEdit: false,
      showEdit: false,
      is_admin: false,
      loading: true,
      utilitiesLoading: true,
      utilities: null,
      accomodation: null,
    };
  },
  async mounted() {
    // This uses dep injection to get the route, doing this first is a must.
    const route = useRoute();
    const routeId = route.params.id;

    // Checks access to the admin functionality.
    try {
      const user = await AuthService.getUser();
      this.is_admin = user.is_admin;
    } catch (error) {
      this.is_admin = false;
    }

    // Prepare the details page
    const accResponse = await AccomodationService.getAccomodation(routeId);
    this.accomodation = accResponse.data;

    let utils = this.accomodation.utilities;
    if ((utils?.length || 0) > 0 && typeof utils[0] !== "string")
      this.accomodation.plainUtils = utils.map((util) => util.id);

    this.loading = false;

    // Saves a request when we are not admin.
    if (this.is_admin) {
      const utlResponse = await UtilityService.getUtilities();
      this.utilities = utlResponse.data;
      this.utilitiesLoading = false;
    }
  },
  methods: {
    handleEdit: async function () {
      // Safety returns to prevent unauthorized and duplicate requests.
      if (!this.is_admin) return;
      if (this.disableEdit) return;

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
        utilities: this.accomodation.plainUtils,
      };

      try {
        this.disableEdit = true;
        await AccomodationService.editAccomodation(this.accomodation.id, data);
        this.router.go();
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Updating failed",
          message: `Something went wrong trying to update this accomodation: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableEdit = false;
      }
    },
    handleDelete: async function () {
      // Safety return to prevent unauthorized requests.
      if (!this.is_admin) return;

      const accomodation = this.accomodation;
      const router = this.router;

      const alert = await alertController.create({
        header: "Are you sure?",
        message: `Are you sure you want to delete ${accomodation.name}? This action cannot be undone.`,
        buttons: [
          {
            text: "No",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: async function () {
              await AccomodationService.deleteAccomodation(accomodation.id);
              router.push("/tabs/accomodations");
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
