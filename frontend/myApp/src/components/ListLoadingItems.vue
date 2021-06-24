<template>
  <ion-item v-for="n in number" :key="n">
    <ion-thumbnail slot="start">
      <ion-skeleton-text animated></ion-skeleton-text>
    </ion-thumbnail>
    <ion-label>
      <h3>
        <ion-skeleton-text animated style="width: 50%"></ion-skeleton-text>
      </h3>
      <p>
        <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
      </p>
    </ion-label>
  </ion-item>
</template>

<script>
import { IonItem, IonLabel, IonThumbnail, IonSkeletonText } from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ListLoadingItems",
  components: { IonItem, IonLabel, IonThumbnail, IonSkeletonText },
  props: {
    number: {
      type: Number,
      default: 8,
    },
  },
});
</script>
