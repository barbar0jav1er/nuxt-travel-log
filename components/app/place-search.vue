<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { NominatimResult } from "~/lib/types";

import { SearchSchema } from "~/lib/zod-schemas";

const emit = defineEmits<{ resultSelected: [result: NominatimResult] }>();

const form = useTemplateRef("form");
const searchResults = ref<NominatimResult[]>([]);
const loading = ref(false);
const hasSearched = ref(false);
const errorMessage = ref("");

async function onSubmit(query: Record<string, string>) {
  try {
    loading.value = true;
    hasSearched.value = true;
    errorMessage.value = "";
    searchResults.value = [];
    const result = await $fetch("/api/search", {
      query,
    });
    searchResults.value = result;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  loading.value = false;
}

function setLocation(result: NominatimResult) {
  emit("resultSelected", result);
  searchResults.value = [];
  hasSearched.value = false;
  errorMessage.value = "";
  if (form.value) {
    form.value.resetForm();
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Form
      ref="form"
      v-slot="{ errors }"
      class="flex flex-col items-center gap-2"
      :validation-schema="toTypedSchema(SearchSchema)"
      :initial-values="{ q: '' }"
      @submit="onSubmit"
    >
      <div class="join mt-4">
        <div>
          <label class="input join-item">
            <Icon name="tabler:search" />
            <Field
              type="text"
              placeholder="Search for a location..."
              name="q"
              :class="{ 'input-error': errors.q }"
              :disabled="loading"
            />
          </label>
          <p v-if="errors.q" class="text-error text-sm mt-2">
            {{ errors.q }}
          </p>
        </div>
        <button class="btn btn-neutral join-item" :disabled="loading">
          Search
        </button>
      </div>
    </Form>
    <div
      v-if="!loading && errorMessage"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ errorMessage }}</span>
    </div>
    <div
      v-if="hasSearched && !searchResults.length && !loading"
      role="alert"
      class="alert alert-warning"
    >
      <span>No results found</span>
    </div>
    <div v-if="loading" class="flex justify-center">
      <div class="loading loading-lg" />
    </div>
    <div class="flex flex-col overflow-auto gap-2 max-h-60 mt-2">
      <div
        v-for="result in searchResults"
        :key="result.place_id"
        class="card bg-base-100 card-sm"
      >
        <div class="card-body">
          <h4 class="card-title">
            {{ result.display_name }}
          </h4>
          <div class="justify-end card-actions">
            <button class="btn btn-warning btn-sm" @click="setLocation(result)">
              Set Location
              <Icon name="tabler:map-pin-share" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
