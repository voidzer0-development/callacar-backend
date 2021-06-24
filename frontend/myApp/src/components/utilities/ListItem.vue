<template>
  <ion-item
    v-if="utility"
    button
    :routerLink="'/utilities/' + utility.id"
    :detail="false"
    class="list-item"
  >
    <ion-icon :icon="powerOutline" slot="start" />
    <ion-label class="ion-text-wrap">
      <h3>{{ utility.name }}</h3>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { powerOutline } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListItem",
  components: {
    IonItem,
    IonLabel,
    IonIcon,
  },
  props: {
    utility: Object,
  },
  setup() {
    return {
      powerOutline,
    };
  },
});
</script>
