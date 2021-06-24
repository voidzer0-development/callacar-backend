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
        <ion-title>Utility</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="utility">
      <div class="ion-padding">
        <h3>{{ utility.name }}</h3>
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
            v-model="utility.name"
            id="utility_name"
            required
          />
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
  alertController,
} from "@ionic/vue";

import { useRoute, useRouter } from "vue-router";
import { defineComponent } from "vue";

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

      utility: null,
    };
  },
  async mounted() {
    const route = useRoute();

    const sitResponse = await UtilityService.getUtility(route.params.id);
    this.utility = sitResponse.data;

    this.loading = false;
  },
  methods: {
    handleEdit: async function () {
      if (this.disableEdit) return;

      const data = {
        name: this.utility.name,
      };

      try {
        this.disableEdit = true;
        await UtilityService.editUtility(this.utility.id, data);
        this.router.go();
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Updating failed",
          message: `Something went wrong trying to update this utility: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableEdit = false;
      }
    },
    handleDelete: async function () {
      const utility = this.utility;
      const router = this.router;

      const alert = await alertController.create({
        header: "Are you sure?",
        message: `Are you sure you want to delete ${utility.name}? This action cannot be undone.`,
        buttons: [
          {
            text: "No",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: async function () {
              await UtilityService.deleteUtility(utility.id);
              router.push("/tabs/utilities");
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
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
