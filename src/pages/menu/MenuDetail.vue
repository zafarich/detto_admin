<script setup>
import { computed, nextTick, onMounted, ref } from "vue-demi";
import { useRouter, useRoute } from "vue-router";

import { useMenuStore } from "src/stores/menu";

const route = useRoute();
const router = useRouter();

const menuStore = useMenuStore();

const data = ref(null);

async function fetchData() {
  await nextTick();
  const id = +route.params.id;
  data.value = (await menuStore.getMenuDetail(id)) || null;
  console.log("data.value", data.value);
}
onMounted(fetchData);

const menu_types = computed(() => {
  const result = [];
  for (let i = 1; i <= 3; i++) {
    const filtered_menus = data.value?.menu_parts?.filter(
      (item) => item.menu_type.id == i
    );

    let obj = {
      type: i,
      menus: filtered_menus,
    };

    if (i === 1) {
      obj = { ...obj, title: "Nonushta" };
    }
    if (i === 2) {
      obj = { ...obj, title: "Tushlik" };
    }
    if (i === 3) {
      obj = { ...obj, title: "Kechgi ovqat" };
    }

    result.push(obj);
  }

  return result;
});
</script>
<template>
  <q-page v-if="data">
    <header class="q-page-header">
      <div class="q-page-header___left">
        <q-btn
          :to="{ name: 'menu' }"
          icon="chevron_left"
          color="primary"
          dense
          outline
        />
        <div class="title ml-3">Menu - {{ data?.calories }} kkal</div>
      </div>
    </header>
    <!-- <pre>{{ menu_types }}</pre> -->
    <div class="menu-types">
      <div
        v-for="(menu_type, index) in menu_types"
        :key="index"
        class="menu-item"
      >
        <div class="menu-header">
          {{ menu_type.title }}
        </div>

        <div class="menus-body">
          <div
            v-for="(one_menu, index) in menu_type?.menus"
            :key="one_menu.id"
            class="one-menu-item"
          >
            <b class="mr-2">{{ index + 1 }}.</b>
            <div class="menu-right">
              <div class="products-wrap">
                <div
                  v-for="product in one_menu?.menu_part_products"
                  :key="product.id"
                  class="product-item"
                >
                  <div>
                    {{ product?.product?.title?.uz }}
                    {{ product?.measure_type_count }}
                    {{ product?.product?.measure_type?.title?.uz }}

                    {{
                      product?.measure_cup_count
                        ? `(${
                            product?.measure_cup_count +
                            " " +
                            product?.product?.measure_cup?.title?.uz
                          })`
                        : ""
                    }}
                  </div>
                  <b>{{ product?.calories }} kkal</b>
                </div>
              </div>

              <div class="menu-bottom">
                <q-btn icon="edit" size="sm" outline dense color="primary" />
                <b class="all-calory">{{ one_menu.calories }} kkal</b>
              </div>
            </div>
          </div>
          <div
            v-for="(one_menu, index) in menu_type?.menus"
            :key="one_menu.id"
            class="one-menu-item"
          >
            <b class="mr-2">{{ index + 1 }}.</b>
            <div class="menu-right">
              <div class="products-wrap">
                <div
                  v-for="product in one_menu?.menu_part_products"
                  :key="product.id"
                  class="product-item"
                >
                  <div>
                    {{ product?.product?.title?.uz }}
                    {{ product?.measure_type_count }}
                    {{ product?.product?.measure_type?.title?.uz }}

                    {{
                      product?.measure_cup_count
                        ? `(${
                            product?.measure_cup_count +
                            " " +
                            product?.product?.measure_cup?.title?.uz
                          })`
                        : ""
                    }}
                  </div>
                  <b>{{ product?.calories }} kkal</b>
                </div>
              </div>

              <div class="menu-bottom">
                <q-btn icon="edit" size="sm" outline dense color="primary" />
                <b class="all-calory">{{ one_menu.calories }} kkal</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.menu-types {
  display: flex;
  border: 1px solid #ccc;
  .menu-item {
    width: calc(100% / 3);
    border-right: 1px solid #ccc;
    &:last-child {
      border-right: none;
    }
  }
  .menu-header {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #ccc;
    padding: 12px;
  }

  .menus-body {
    // padding: 10px;
  }

  .one-menu-item {
    display: flex;
    padding: 12px;
    border-bottom: 1px solid #ccc;
    &:last-child {
      border-bottom: none;
    }
  }

  .products-wrap {
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  }

  .menu-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0px;
  }

  .menu-right {
    width: calc(100% - 25px);
  }

  .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .all-calory {
    color: $primary;
  }
}
</style>
