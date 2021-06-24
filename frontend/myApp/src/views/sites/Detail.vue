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

    <ion-content :fullscreen="true" v-if="site">
      <div class="ion-padding">
        <h3>{{ site?.name }}</h3>
        <h4>Details</h4>
        <ul>
          <li>Accomodation: {{ site.accomodation?.name }}</li>
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
            v-model="site.name"
            id="site_name"
            required
          />
        </ion-item>

        <ion-item>
          <ion-label>Accomodation</ion-label>
          <ion-select v-model="site.plainAccomodation">
            <ion-select-option
              v-for="accomodation in accomodations"
              :key="accomodation.id"
              :value="accomodation.id"
              >{{ accomodation?.name }}</ion-select-option
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

      disableEdit: false,
      showEdit: false,

      site: null,
      accomodations: null,
    };
  },
  async mounted() {
    const route = useRoute();

    const sitResponse = await SiteService.getSite(route.params.id);
    this.site = sitResponse.data;

    const accResponse = await AccomodationService.getAccomodations();
    this.accomodations = accResponse.data;

    const accomodation = this.site.accomodation;
    if (accomodation && typeof accomodation !== "string")
      this.site.plainAccomodation = accomodation.id;

    this.loading = false;
  },
  methods: {
    handleEdit: async function () {
      if (this.disableEdit) return;

      const data = {
        name: this.site?.name,
        accomodation: this.site.plainAccomodation,
      };

      try {
        this.disableEdit = true;
        await SiteService.editSite(this.site.id, data);
        this.router.go();
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Updating failed",
          message: `Something went wrong trying to update this site: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableEdit = false;
      }
    },
    handleDelete: async function () {
      const site = this.site;
      const router = this.router;

      const alert = await alertController.create({
        header: "Are you sure?",
        message: `Are you sure you want to delete ${site?.name}? This action cannot be undone.`,
        buttons: [
          {
            text: "No",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: async function () {
              await SiteService.deleteSite(site.id);
              router.push("/tabs/sites");
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
