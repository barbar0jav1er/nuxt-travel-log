<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <label class="swap swap-rotate mx-4">
    <input v-model="isDark" type="checkbox">
    <Icon
      name="tabler:sun"
      class="swap-on"
      size="24"
    />
    <Icon
      name="tabler:moon-filled"
      class="swap-off"
      size="24"
    />
  </label>
</template>
