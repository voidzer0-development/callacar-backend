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
        <ion-title>Reservation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="reservation">
      <div class="ion-padding">
        <h3>{{ reservation.id }}</h3>
        <h4>Details</h4>
        <ul>
          <li>Date From: {{ reservation.date_from?.split("T")[0] }}</li>
          <li>Date To: {{ reservation.date_to?.split("T")[0] }}</li>
          <li>Site: {{ this.site.name}}</li>
          <li>Customer: {{ reservation.customer.name }}</li>
          <li>
            Guests:
            <ul>
              <li v-for="customer in reservation.guests" :key="customer.id">
                {{ customer.name }}
              </li>
            </ul>
          </li>
          <li>
            Facilities:
            <ul>
              <li v-for="facility in reservation.facilities" :key="facility.id">
                {{ facility.name }}
              </li>
            </ul>
          </li>
          <li>Booked: {{ reservation.is_booked ? "Yes" : "No" }}</li>
        </ul>
      </div>

      <ion-button :disabled="showEdit" @click="showEdit = true"
        >Edit</ion-button
      >
      <ion-button color="danger" @click="handleDelete">Delete</ion-button>

      <div class="ion-padding" v-show="showEdit">
        <ion-item>
          <ion-label position="floating">Date From</ion-label>
          <ion-datetime
            display-format="MMMM DD, YYYY"
            v-model="reservation.date_from"
            id="reservation_date_from"
            required
          />
        </ion-item>

        <ion-item>
          <ion-label position="floating">Date To</ion-label>
          <ion-datetime
            display-format="MMMM DD, YYYY"
            v-model="reservation.date_to"
            id="reservation_date_to"
            required
          />
        </ion-item>

        <ion-item>
          <ion-label>Facilities</ion-label>
          <ion-select multiple="true" v-model="reservation.plainFacs">
            <ion-select-option
              v-for="facility in facilities"
              :key="facility.id"
              :value="facility.id"
              >{{ facility.name }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Site</ion-label>
          <ion-select v-model="reservation.plainSite">
            <ion-select-option
              v-for="site in sites"
              :key="site.id"
              :value="site.id"
              >{{ site.name }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Customer</ion-label>
          <ion-select v-model="reservation.plainCustomer">
            <ion-select-option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
              >{{ customer.name }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Guests</ion-label>
          <ion-select multiple="true" v-model="reservation.plainGuests">
            <ion-select-option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
              >{{ customer.name }}</ion-select-option
            >
          </ion-select>
        </ion-item>

        <ion-item lines="full">
          <ion-label>Booked</ion-label>
          <ion-checkbox
            slot="end"
            @update:modelValue="reservation.is_booked = $event"
            :modelValue="reservation.is_booked"
          >
          </ion-checkbox>
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
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  alertController,
} from "@ionic/vue";

import { useRoute, useRouter } from "vue-router";
import { defineComponent } from "vue";

import { ReservationService } from "@/services/reservation.service";
import { CustomerService } from "@/services/customer.service";
import { SiteService } from "@/services/site.service";
import { FacilityService } from "@/services/facility.service";

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

      reservation: null,
      customer: null,
      customers: null,
      site: null,
      sites: null,
      facilities: null,
    };
  },
  async mounted() {
    const route = useRoute();
    const routeId = route.params.id;

    const resResponse = await ReservationService.getReservation(routeId);
    this.reservation = resResponse.data;

    const custgResponse = await CustomerService.getCustomers();
    this.customers = custgResponse.data;

    const site1Response = await SiteService.getSite(this.reservation.site.id);
    this.site = site1Response.data;


    const siteResponse = await SiteService.getSites();
    this.sites = siteResponse.data;

    const facResponse = await FacilityService.getFacilities();
    this.facilities = facResponse.data;

    const fac = this.reservation.facilities;
    if ((fac?.length || 0) > 0 && typeof fac[0] !== "string")
      this.reservation.plainFacs = fac.map((util) => util.id);

    const site = this.reservation.site;
    if (site && typeof site !== "string") this.reservation.plainSite = site.id;

    const customer = this.reservation.customer;
    if (customer && typeof customer !== "string")
      this.reservation.plainCustomer = customer.id;

    const guests = this.reservation.guests;
    if ((guests?.length || 0) > 0 && typeof guests[0] !== "string")
      this.reservation.plainGuests = guests.map((util) => util.id);

    this.loading = false;
  },
  methods: {
    handleEdit: async function () {
      if (this.disableEdit) return;

      const data = {
        id: this.reservation.id,
        customer: this.reservation.plainCustomer,
        guests: this.reservation.plainGuests,
        site: this.reservation.plainSite,
        date_from: this.reservation.date_from.split("T")[0],
        date_to: this.reservation.date_to.split("T")[0],
        facilities: this.reservation.plainFacs,
        is_booked: this.reservation.is_booked,
      };

      try {
        this.disableEdit = true;
        await ReservationService.editReservation(this.reservation.id, data);
        this.router.go();
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Updating failed",
          message: `Something went wrong trying to update this reservation: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableEdit = false;
      }
    },
    handleDelete: async function () {
      const reservation = this.reservation;
      const router = this.router;

      const alert = await alertController.create({
        header: "Are you sure?",
        message: `Are you sure you want to delete ${reservation.id}? This action cannot be undone.`,
        buttons: [
          {
            text: "No",
            role: "cancel",
          },
          {
            text: "Yes",
            handler: async function () {
              await ReservationService.deleteReservation(reservation.id);
              router.push("/tabs/reservations");
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
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonDatetime,
  },
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
