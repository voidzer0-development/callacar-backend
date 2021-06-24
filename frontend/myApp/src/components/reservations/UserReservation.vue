<template>
  <div>
    <ion-list>
      <ion-list-header>1. Find an accomodation</ion-list-header>
      <ion-item lines="full">
        <p>
          First off, please find an accomodation you would like to stay at by
          selecting an accomodation and the dates you want to reserve it. We'll
          check if it's available for you and let you know.
        </p>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Type</ion-label>
        <ion-select
          placeholder="Select an accomodation..."
          interface="popover"
          required
          v-model="stepOneAccId"
          @ionChange="checkStepOne"
        >
          <ion-select-option
            v-for="accomodation in accomodations"
            :key="accomodation.id"
            :value="accomodation.id"
            >{{ accomodation.name }}</ion-select-option
          >
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Start Date</ion-label>
        <ion-datetime
          display-format="MMMM DD, YYYY"
          :min="new Date().toISOString()"
          :max="new Date().getFullYear() + 2"
          v-model="reservation.date_from"
          @ionChange="checkStepOne"
        ></ion-datetime>
      </ion-item>
      <ion-item>
        <ion-label position="floating">End Date</ion-label>
        <ion-datetime
          display-format="MMMM DD, YYYY"
          :min="new Date().toISOString()"
          :max="new Date().getFullYear() + 2"
          v-model="reservation.date_to"
          @ionChange="checkStepOne"
        ></ion-datetime>
      </ion-item>
      <ion-item lines="full" v-show="stepOneValid === false">
        <ion-text color="danger">
          This accomodation isn't available during your selected stay, please
          choose a different range.
        </ion-text>
      </ion-item>
      <ion-item lines="full" v-show="stepOneValid === true">
        <ion-text color="success">
          You're good to go, this accomodation is available during your stay.
        </ion-text>
      </ion-item>
    </ion-list>
    <ion-list>
      <ion-list-header>2. Make the reservation</ion-list-header>
      <ion-item>
        <ion-label position="floating">Site</ion-label>
        <ion-select
          placeholder="Select an available site (optional)..."
          interface="popover"
          v-model="reservation.site"
          :disabled="stepOneValid !== true"
        >
          <ion-select-option
            v-for="site in stepOneFreeSites"
            :key="site.id"
            :value="site.id"
          >
            {{ site.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Facilities</ion-label>
        <ion-select
          placeholder="Select facilities you'd like to rent..."
          multiple="true"
          required
          v-model="reservation.facilities"
          :disabled="stepOneValid !== true"
        >
          <ion-select-option
            v-for="facility in facilities"
            :key="facility.id"
            :value="facility.id"
            >{{ facility.name }} (€{{
              facility.price?.toFixed(2)
            }}/day)</ion-select-option
          >
        </ion-select>
      </ion-item>
      <ion-item lines="full">
        <p style="margin-top: 30px">
          Please enter your personal details to make the reservation for. If
          you're staying with guests, don't worry, you'll be able to provide
          their details in the next step.
        </p>
      </ion-item>
      <ion-radio-group v-model="reservation.customer" @ionChange="checkStepTwo">
        <ion-item
          v-for="customer in relations"
          :key="customer.id"
          :detail="false"
          lines="full"
          :disabled="stepOneValid !== true"
        >
          <ion-icon :icon="personOutline" slot="start" />
          <ion-label class="ion-text-wrap">
            <h3>{{ customer.name }}</h3>
            <h4 v-if="getAge(customer.date_of_birth) < 18" style="opacity: 0.7">
              This person is not an adult (18+).
            </h4>
          </ion-label>
          <ion-button
            fill="clear"
            slot="end"
            @click="openGuestModal(customer.id)"
            :disabled="stepOneValid !== true"
          >
            <ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon>
          </ion-button>
          <ion-radio
            slot="end"
            :value="customer.id"
            :disabled="
              stepOneValid !== true || getAge(customer.date_of_birth) < 18
            "
          ></ion-radio>
        </ion-item>
      </ion-radio-group>
      <ion-button
        expand="block"
        @click="openGuestModal()"
        :disabled="stepOneValid !== true"
        style="margin: 30px 0"
      >
        Create new
      </ion-button>
    </ion-list>
    <ion-list>
      <ion-list-header>3. Who's coming?</ion-list-header>
      <ion-item lines="full">
        <p>
          Please select the guests that are coming with you on this trip. To add
          a new guest to your personal contacts, please select the "Create new
          guest" button.
        </p>
      </ion-item>
      <ion-item
        v-for="customer in relations"
        :key="customer.id"
        :detail="false"
        lines="full"
        :disabled="stepTwoValid !== true"
      >
        <ion-icon
          :icon="
            customer.id === reservation.customer
              ? personOutline
              : personAddOutline
          "
          slot="start"
        />
        <ion-label class="ion-text-wrap">
          <h3>{{ customer.name }}</h3>
          <h4 v-if="customer.id === reservation.customer" style="opacity: 0.7">
            This person is the host of this reservation.
          </h4>
        </ion-label>
        <ion-button
          fill="clear"
          slot="end"
          @click="openGuestModal(customer.id)"
          :disabled="stepTwoValid !== true"
        >
          <ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon>
        </ion-button>
        <ion-checkbox
          slot="end"
          @update:modelValue="
            customer.isChecked = customer.id !== reservation.customer && $event;
            checkStepThree();
          "
          :modelValue="
            customer.id !== reservation.customer && customer.isChecked
          "
          :disabled="
            stepTwoValid !== true || customer.id === reservation.customer
          "
        ></ion-checkbox>
      </ion-item>
      <ion-button
        expand="block"
        @click="openGuestModal()"
        :disabled="stepTwoValid !== true"
        style="margin: 30px 0"
      >
        Create new guest
      </ion-button>
    </ion-list>
    <ion-list>
      <ion-list-header>4. Confirm your details</ion-list-header>
      <table class="totals-table">
        <tr class="totals-header">
          <th>Description</th>
          <th>Price</th>
        </tr>
        <tr>
          <td>Accomodation</td>
          <td>€{{ accomodationPrice.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Rented facilities</td>
          <td>€{{ facilityPrice.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Price per night (adults)</td>
          <td>€{{ guestsPrice.adults.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Price per night (children)</td>
          <td>€{{ guestsPrice.children.toFixed(2) }}</td>
        </tr>
        <tr>
          <td>Taxes per night</td>
          <td>€{{ guestsPrice.taxes.toFixed(2) }}</td>
        </tr>
        <tr>
          <td><strong>Totals</strong></td>
          <td>
            <strong>€{{ totalPrice.toFixed(2) }}</strong>
          </td>
        </tr>
      </table>
      <ion-button
        expand="block"
        @click="submit"
        :disabled="
          stepOneValid !== true || stepTwoValid !== true || disableSubmit
        "
        style="margin: 30px 0"
      >
        Make reservation
      </ion-button>
    </ion-list>
  </div>
</template>

<script>
import {
  IonItem,
  IonLabel,
  IonDatetime,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonText,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  alertController,
  toastController,
  modalController,
} from "@ionic/vue";

import { personOutline, personAddOutline, pencilOutline } from "ionicons/icons";

import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import GuestsForm from "@/components/reservations/GuestsForm.vue";

import { AuthService } from "@/services/auth.service";
import { AccomodationService } from "@/services/accomodation.service";
import { CustomerService } from "@/services/customer.service";
import { FacilityService } from "@/services/facility.service";
import { ReservationService } from "@/services/reservation.service";
import { SiteService } from "@/services/site.service";

export default defineComponent({
  name: "UserReservation",
  data() {
    return {
      loading: true,
      disableSubmit: false,

      // External relations.
      accomodations: null,
      facilities: null,
      relations: null,
      sites: null,

      // Step 1 specific model items.
      stepOneAccId: null,
      stepOneValid: null,
      stepOneFreeSites: null,

      // Step 2 specific model items.
      stepTwoValid: null,

      // The model that will be sent to our API.
      reservation: {
        site: null,
        facilities: null,
        guests: [],
      },
    };
  },
  computed: {
    stayPeriodInDays: function () {
      if (!this.reservation.date_from || !this.reservation.date_to) return 0;

      const startDate = new Date(this.reservation.date_from?.split("T")[0]);
      const endDate = new Date(this.reservation.date_to?.split("T")[0]);
      const difference = endDate.getTime() - startDate.getTime();
      const period = difference / (1000 * 3600 * 24) + 1;

      return period;
    },
    stayPeriodInDaysSeasonal: function () {
      const result = {
        low: 0,
        mid: 0,
        high: 0,
      };

      if (!this.reservation.date_from || !this.reservation.date_to)
        return result;

      const period = this.stayPeriodInDays;
      if (period < 1) return result;

      // This is a lookup table for the seasons. The way this works is as follows:
      // - First item is the type of season, should correspond to a property in result.
      // - Second item is the date the type of season starts, format MMDD.
      // - The array is reversed from 1231 (Dec 31st) to 0101 (Jan 1st) to allow effective lookup.
      const seasons = [
        ["low", "1101"],
        ["mid", "0916"],
        ["high", "0616"],
        ["mid", "0501"],
        ["low", "0101"],
      ];

      const startDate = new Date(this.reservation.date_from?.split("T")[0]);
      for (let i = 0; i < period; i++) {
        // Create our MMDD format string, making sure to pad zeroes.
        const date =
          String(startDate.getMonth() + 1).padStart(2, 0) +
          String(startDate.getDate()).padStart(2, 0);

        // Find the first (which is the highest) date defined in the seasons lookup.
        // Because the lookup is reversed, we can "sift" through the array in an efficient
        // manner to reach our desired closest date.
        const type = seasons.find((s) => s[1] <= date)[0];

        // If not found in the lookup, we are in a unrecoverable state, error out.
        if (!type) {
          throw new Error(
            `stayPeriodInDaysSeasonal: Couldn't find a date within the seasons lookup.\n
            Date: ${date} | Seasons: ${JSON.stringify(seasons)}`
          );
        }

        // Once we find the corresponding type we can simply mutate the resulst property.
        result[type]++;

        // Finally, move on one day to continue checking our range. There is potential big-O
        // improvements to be gained by checking the range in the array somehow, perhaps by
        // using the difference between start and end, but this is fine for this use case.
        startDate.setDate(startDate.getDate() + 1);
      }

      return result;
    },
    accomodationPrice: function () {
      const period = this.stayPeriodInDays;
      if (period < 1) return 0;

      if (!this.stepOneAccId) return 0;
      const accomodation = this.accomodations.find(
        (a) => a.id === this.stepOneAccId
      );
      if (!accomodation) return 0;

      const days = period % 7;
      const weeks = Math.floor(period / 7) % 2;
      const seasons = Math.floor(Math.floor(period / 7) / 2);

      const accDailyPrice = accomodation.daily_price;
      const accSeasonPrice = accomodation.season_price;
      let accomodationPrice = 0;

      // Add loose days and weeks.
      accomodationPrice += days * accDailyPrice;
      accomodationPrice += weeks * 7 * accDailyPrice;

      // Add seasons (if applicable to this acc)
      // More than 1 season means it's a stay of at least 4 weeks.
      if (accSeasonPrice > 0 && seasons > 1)
        accomodationPrice += seasons * accSeasonPrice;
      else accomodationPrice += seasons * 14 * accDailyPrice;

      return accomodationPrice;
    },
    facilityPrice: function () {
      const period = this.stayPeriodInDays;
      if (period < 1) return 0;

      const facilities = this.facilities.filter((fac) =>
        this.reservation.facilities?.includes(fac.id)
      );

      if ((facilities?.length || 0) < 1) return 0;

      let facilityPrice = 0;
      facilities.forEach((fac) => {
        facilityPrice += fac.price * period;
      });

      return facilityPrice;
    },
    guestsPrice: function () {
      const result = {
        adults: 0,
        children: 0,
        taxes: 0,
      };

      const period = this.stayPeriodInDays;
      if (period < 1) return result;

      const periodSeasonal = this.stayPeriodInDaysSeasonal;

      // We always start with 1 adult (the reservation will have to made by an adult).
      let adults = 1;
      let children = 0;

      if ((this.reservation?.guests?.length || 0) > 0) {
        this.reservation.guests.forEach((guest) => {
          // For accreditation, please see function definition above.
          const age = this.getAge(guest.date_of_birth);
          if (age > 12) adults++;
          else children++;
        });
      }

      // Adults: Full prices.
      result["adults"] += adults * periodSeasonal.low * 0.5;
      result["adults"] += adults * periodSeasonal.mid * 1.5;
      result["adults"] += adults * periodSeasonal.high * 3;

      // Children: Halved prices from adults.
      result["children"] += children * periodSeasonal.low * 0.25;
      result["children"] += children * periodSeasonal.mid * 0.75;
      result["children"] += children * periodSeasonal.high * 1.5;

      // Taxes: €1 per day per any person.
      result["taxes"] += adults * period * 1;
      result["taxes"] += children * period * 1;

      return result;
    },
    totalPrice: function () {
      return (
        this.accomodationPrice +
        this.facilityPrice +
        this.guestsPrice.adults +
        this.guestsPrice.children +
        this.guestsPrice.taxes
      );
    },
  },
  async mounted() {
    this.user = await AuthService.getUser();

    const accResponse = await AccomodationService.getAccomodations();
    this.accomodations = accResponse.data;

    const siteResponse = await SiteService.getSites();
    this.sites = siteResponse.data;

    const facResponse = await FacilityService.getFacilities();
    this.facilities = facResponse.data;

    const relResponse = await CustomerService.getCustomersByUser(this.user.id);
    this.relations = relResponse.data;

    this.loading = false;
  },
  methods: {
    async checkStepOne() {
      if (
        !this.stepOneAccId ||
        !this.reservation.date_from ||
        !this.reservation.date_to
      )
        return;

      const startDate = this.reservation.date_from.split("T")[0];
      const endDate = this.reservation.date_to.split("T")[0];

      if (new Date(startDate) > new Date(endDate)) {
        this.stepOneValid = null;
        const toast = await toastController.create({
          message: "Please make sure the start date is before the end date.",
          duration: 3000,
        });
        return toast.present();
      }

      const result = await SiteService.getFreeSites(startDate, endDate);

      if (result.status !== 200) {
        this.stepOneValid = false;
        const toast = await toastController.create({
          message: "Something went wrong, please try again later.",
          duration: 3000,
        });
        return toast.present();
      }

      this.stepOneFreeSites = result.data.filter(
        (s) => s.accomodation === this.stepOneAccId
      );

      this.stepOneValid = this.stepOneFreeSites.length > 0;
    },
    async checkStepTwo() {
      this.stepTwoValid = !!this.reservation.customer;
    },
    async checkStepThree() {
      this.reservation.guests = this.relations
        ?.filter((rel) => rel.isChecked)
        .map((rel) => {
          if (rel.id) return rel.id;
          return rel;
        });
    },

    // The function it's all about, the submit function.
    async submit() {
      try {
        this.disableSubmit = true;

        if (!this.reservation.site)
          this.reservation.site = this.stepOneFreeSites[0].id;

        if (!this.reservation.facilities) this.reservation.facilities = [];
        this.reservation.date_from = this.reservation.date_from.split("T")[0];
        this.reservation.date_to = this.reservation.date_to.split("T")[0];

        const res = await ReservationService.createReservation(
          this.reservation
        );

        console.log(res);
        const toast = await toastController.create({
          message: `Your reservation has been successfully placed. We will reach out to you through e-mail regarding further details soon! In case you don't hear from us, please call us and provide "${res.data.id}" as a reference. Thank you!`,
          duration: 10000,
        });
        toast.present();

        this.router.push("/");
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this reservation: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableSubmit = false;
      }
    },

    // Guest modal specific methods.
    async openGuestModal(id) {
      const self = this;
      const modal = await modalController.create({
        backdropDismiss: false,
        component: GuestsForm,
        componentProps: {
          userId: id || null,
        },
      });

      modal.onDidDismiss().then(function (event) {
        self.guestModalClosed(event.data);
      });

      return modal.present();
    },
    async guestModalClosed(id) {
      if (!id) return;
      const relResponse = await CustomerService.getCustomersByUser(
        this.user.id
      );
      this.relations = relResponse.data;
    },

    // Credit for this method goes to Naveen on StackOverflow.
    // Retrieved March 16th, 2021 from https://stackoverflow.com/a/7091965.
    getAge(date) {
      const today = new Date();
      const birthDate = new Date(date);

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

      return age;
    },
  },
  setup() {
    const router = useRouter();
    return { router, personOutline, personAddOutline, pencilOutline };
  },
  components: {
    IonItem,
    IonLabel,
    IonDatetime,
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption,
    IonText,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonRadio,
    IonRadioGroup,
  },
});
</script>

<style scoped>
.totals-table {
  width: 100%;
  border: solid 1px rgb(118, 118, 118);
}
.totals-table .totals-header th {
  text-align: left;
  padding: 12px 4px;
}
.totals-table tr,
.totals-table tr td {
  padding: 4px 4px;
  border-bottom: solid 1px rgb(118, 118, 118);
}
</style>