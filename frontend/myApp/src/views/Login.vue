<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <form @submit.prevent="handleLogin">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Login</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            Please log in to get access the reservations, sites, accomodations
            and more in the Flierefluiter app!
          </ion-card-content>

          <ion-card-content>
            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input
                type="email"
                v-model="form.email"
                id="email"
                required
              ></ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input
                type="password"
                v-model="form.password"
                id="password"
                required
              ></ion-input>
            </ion-item>
          </ion-card-content>

          <ion-card-content>
            <ion-button type="submit">
              <ion-icon slot="start" :icon="logIn"></ion-icon>
              Login
            </ion-button>
            <ion-button type="button" router-link="/register">
              <ion-icon slot="start" :icon="personAdd"></ion-icon>
              Register
            </ion-button>
          </ion-card-content>
        </ion-card>
      </form>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  alertController,
} from "@ionic/vue";

import { logIn, personAdd } from "ionicons/icons";
import { useRouter } from "vue-router";
import { AuthenticationError, AuthService } from "@/services/auth.service";

export default {
  name: "Login",
  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const router = useRouter();
    return {
      router,
      logIn,
      personAdd,
    };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      if (this.form.email && this.form.password) {
        const loginUser = {
          email: this.form.email,
          password: this.form.password,
        };

        // Login.
        try {
          await AuthService.login(loginUser.email, loginUser.password);
          this.router.push("/");
        } catch (error) {
          if (error instanceof AuthenticationError) {
            const errorAlert = await alertController.create({
              header: `Login failed (#${error.errorCode})`,
              message: `Something went wrong trying to log in: ${
                error.message || "Unknown Error"
              }`,
              buttons: ["OK"],
            });
            await errorAlert.present();
          } else {
            const errorAlert = await alertController.create({
              header: "Login failed",
              message:
                "Something went wrong trying to log in, please try again.",
              buttons: ["OK"],
            });
            await errorAlert.present();
          }
        }
      } else {
        const errorAlert = await alertController.create({
          header: "Login failed",
          message:
            "Please make sure you properly filled in all required information.",
          buttons: ["OK"],
        });
        await errorAlert.present();
      }
    },
  },
};
</script>