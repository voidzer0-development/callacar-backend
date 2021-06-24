<template>
  <div class="ion-padding">
    <h2 style="margin-top: 0" v-if="userId && customer.name">
      Edit {{ customer.name }}
    </h2>
    <h2 style="margin-top: 0" v-else-if="userId">Edit guest</h2>
    <h2 style="margin-top: 0" v-else>New guest</h2>

    <ion-list>
      <ion-item>
        <ion-label position="floating">Name</ion-label>
        <ion-input
          type="text"
          class="form-control"
          v-model="customer.name"
          id="customer_name"
          required
        />
      </ion-item>

      <ion-item>
        <ion-label position="floating">Date of Birth</ion-label>
        <ion-datetime
          display-format="MMMM DD, YYYY"
          :max="new Date().toISOString()"
          v-model="customer.date_of_birth"
          required
        ></ion-datetime>
      </ion-item>
    </ion-list>

    <p>
      The following fields are only required if they are different from the
      details of the one making the reservation.
    </p>

    <ion-list>
      <ion-item>
        <ion-label position="floating">Address</ion-label>
        <ion-input
          type="text"
          class="form-control"
          v-model="customer.address"
          id="customer_adress"
          required
        />
      </ion-item>

      <ion-item>
        <ion-label position="floating">Zipcode</ion-label>
        <ion-input
          type="text"
          class="form-control"
          v-model="customer.zipcode"
          id="customer_zipcode"
          required
        />
      </ion-item>

      <ion-item>
        <ion-label position="floating">City</ion-label>
        <ion-input
          type="text"
          class="form-control"
          v-model="customer.city"
          id="customer_city"
          required
        />
      </ion-item>

      <ion-item>
        <ion-label position="floating">Country</ion-label>
        <ion-input
          type="text"
          class="form-control"
          v-model="customer.country"
          id="customer_country"
          required
        />
      </ion-item>
    </ion-list>

    <ion-button @click="saveGuest" :disabled="disableSubmit">Save</ion-button>
    <ion-button color="medium" @click="cancel">Cancel</ion-button>
  </div>
</template>

<script>
import {
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonList,
  IonButton,
  alertController,
  modalController,
} from "@ionic/vue";
import { defineComponent } from "vue";

import { AuthService } from "@/services/auth.service";
import { CustomerService } from "@/services/customer.service";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonList,
    IonButton,
  },
  props: {
    userId: String,
  },
  data() {
    return {
      disableSubmit: false,
      loading: true,
      customer: {
        name: null,
        date_of_birth: null,
        address: null,
        zipcode: null,
        city: null,
        country: null,
        has_id_card: false,
        has_passport: false,
        created_by: null,
      },
    };
  },
  async mounted() {
    this.user = await AuthService.getUser();

    if (this.userId) {
      const response = await CustomerService.getCustomer(this.userId);
      this.customer = response.data;
    }

    this.loading = false;
  },
  methods: {
    async saveGuest() {
      if (this.disableSubmit) return;

      try {
        this.disableSubmit = true;

        this.customer.date_of_birth = this.customer.date_of_birth.split("T")[0];
        this.customer.created_by = this.user.id;

        let result = null;
        if (this.userId) {
          const response = await CustomerService.editCustomer(this.userId, this.customer);
          result = response.data.id;
        } else {
          const response = await CustomerService.createCustomer(this.customer);
          result = response.data.id;
        }

        await modalController.dismiss(result);
      } catch (error) {
        const errorAlert = await alertController.create({
          header: "Creating failed",
          message: `Something went wrong trying to create this customer: ${
            error.message || "Unknown Error"
          }`,
          buttons: ["OK"],
        });
        await errorAlert.present();
        this.disableSubmit = false;
      }
    },
    async cancel() {
      await modalController.dismiss(null);
    },
  },
  setup() {
    return {};
  },
});
</script>
