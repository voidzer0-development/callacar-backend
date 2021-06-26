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
        <ion-title>ride</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="ride">
      <div class="ion-padding">
        <h3>{{ ride.endPoint }}</h3>
        <h4>Details</h4>
        <ul>
          <li>
            Car: {{ride.car }}
          </li>
          <li>
            startPoint: {{ride.startPoint }}
          </li>
          <li>
            endPoint: {{ride.endPoint }}
          </li>
          <li>
            ETA: 15 minutes
          </li>

         
        </ul>
      </div>

      <!-- <ion-button :disabled="showEdit"
        >Pay</ion-button
      > -->
      <ion-button color="danger">Pay</ion-button>

      <!-- <div class="ion-padding" v-show="showEdit">
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

        <ion-button color="light" @click="showEdit = false">
          Cancel
        </ion-button>
        <ion-button :disabled="disableEdit" @click="handleEdit">
          Save
        </ion-button>
      </div> -->
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
  // IonItem,
  // IonLabel,
  // IonInput,
  // IonSelect,
  // IonSelectOption,
  // alertController,
} from "@ionic/vue";

import { useRoute, useRouter } from "vue-router";
import { defineComponent } from "vue";

import { RideService } from "@/services/ride.service";
// import { UtilityService } from "@/services/utility.service";

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

      ride: null,
      utilities: null,
    };
  },
  async mounted() {
    const route = useRoute();

    const rideResponse = await RideService.getById(route.params.id);
    this.ride = rideResponse.data;
    this.loading = false;
  },
  // methods: {
  //   handleEdit: async function () {
  //     if (this.disableEdit) return;

  //     const data = {
  //       name: this.ride.name,
  //       price: Number.parseFloat(this.facility.price) || 0,
  //       dependencies: this.facility.plainDeps,
  //     };

  //     console.log(data);

  //     try {
  //       this.disableEdit = true;
  //       await FacilityService.editFacility(this.facility.id, data);
  //       this.router.go();
  //     } catch (error) {
  //       const errorAlert = await alertController.create({
  //         header: "Updating failed",
  //         message: `Something went wrong trying to update this facility: ${
  //           error.message || "Unknown Error"
  //         }`,
  //         buttons: ["OK"],
  //       });
  //       await errorAlert.present();
  //       this.disableEdit = false;
  //     }
  //   },
  //   handleDelete: async function () {
  //     const facility = this.facility;
  //     const router = this.router;

  //     const alert = await alertController.create({
  //       header: "Are you sure?",
  //       message: `Are you sure you want to delete ${facility.name}? This action cannot be undone.`,
  //       buttons: [
  //         {
  //           text: "No",
  //           role: "cancel",
  //         },
  //         {
  //           text: "Yes",
  //           handler: async function () {
  //             await FacilityService.deleteFacility(facility.id);
  //             router.push("/tabs/facilities");
  //           },
  //         },
  //       ],
  //     });

  //     return alert.present();
  //   },
  // },
  components: {
    IonBackButton,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonTitle,
    // IonItem,
    // IonLabel,
    // IonInput,
    // IonSelect,
    // IonSelectOption,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
