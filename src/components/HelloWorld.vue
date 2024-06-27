<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <p class="desc">Play nested tic tac toe (on the same machine) with your friend!</p>
  <p class="more-to-come">Online multiplayer coming soon.</p>

</template>

<style scoped>
.desc{
  color: white;
  font-size: 14pt;
}
.more-to-come {
  color: white;
  font-size: 12pt;
}
</style>
