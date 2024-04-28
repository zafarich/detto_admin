<script setup>
import { formatDate, formatDateToUTC, getDateNow } from "src/utils/helpers";
import { computed, ref } from "vue-demi";
import { date } from "quasar";
const { addToDate } = date;

const emit = defineEmits(["update:modelValue", "change", "reset"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const selectedType = ref(null);
const monthBtnList = [
  {
    lable: "one_day",
    type: "one_day",
    date: {
      key: "days",
      value: -1,
    },
  },
  {
    lable: "a_week",
    type: "a_week",
    date: {
      key: "days",
      value: -7,
    },
  },
  {
    lable: "months",
    type: "months",
    date: {
      key: "months",
      value: -1,
    },
  },
  {
    lable: "year",
    type: "year",
    date: {
      key: "year",
      value: -1,
    },
  },
];
const dateRangeModel = ref(null);
const qDateProxy = ref(null);

const dateRangeLabel = computed(() => {
  if (!dateRangeModel.value) return "Sanani tanlang";
  return `${formatDate(dateRangeModel.value.from)} - ${formatDate(
    dateRangeModel.value.to
  )}`;
});

function open() {
  emit("update:model-value", true);
}
function close() {
  emit("update:model-value", false);
}
function reset() {
  dateRangeModel.value = null;
  selectedType.value = null;
  emit("reset");
}

function onDateChange(d) {
  const obj = {
    fromDate: formatDateToUTC(d.from),
    toDate: formatDateToUTC(d.to),
  };
  emit("change", obj);
}
</script>
<template>
  <q-dialog
    :model-value="modelValue"
    v-bind="$attrs"
    class="table_filters_dialog"
    @hide="close"
  >
    <q-card>
      <q-btn
        icon="close"
        flat
        dense
        round
        class="close-btn"
        color="grey-5"
        v-close-popup
      />
      <div class="card_wrap">
        <div class="header">
          <div class="title">Saralash</div>
        </div>
        <div class="content">
          <div class="col date_col">
            <div class="label">Sana</div>
            <div class="actions_wrap">
              <div class="btn-group mr-1">
                <q-btn
                  v-for="(item, idx) in monthBtnList"
                  :key="idx"
                  no-caps
                  :color="item.type === selectedType ? 'primary' : 'grey-3'"
                  :class="item.type !== selectedType && 'text-black'"
                  :label="item.lable"
                  class="mr-1"
                  @click="
                    (v) => {
                      dateRangeModel = null;
                      selectedType = item.type;
                      onDateChange({
                        from: addToDate(Date.now(), {
                          [item.date.key]: item.date.value,
                        }),
                        to: getDateNow(),
                      });
                    }
                  "
                />
              </div>
              <q-btn
                no-caps
                :color="dateRangeModel ? 'primary' : 'grey-3'"
                :class="dateRangeModel ? 'text=-white' : 'text-black'"
                icon="calendar_today"
                :label="dateRangeLabel"
              >
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dateRangeModel"
                    range
                    ref="datepicker"
                    square
                    color="primary"
                    today-btn
                    @update:model-value="
                      () => {
                        selectedType = null;
                        qDateProxy.hide();
                        onDateChange({
                          from: formatDate(dateRangeModel.from),
                          to: formatDate(dateRangeModel.to),
                        });
                      }
                    "
                  />
                </q-popup-proxy>
              </q-btn>
            </div>
          </div>
          <slot name="cols" />
        </div>
        <div class="footer">
          <!-- <q-btn :label="t('Apply_filters')" class="mr-2" no-caps color="primary" /> -->
          <q-btn
            label="Filterni tozalash"
            no-caps
            color="grey-4"
            class="text-dark"
            v-close-popup
            @click="reset"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<style scoped lang="scss">
.table_filters_dialog {
  .q-card {
    max-width: 620px;
    width: 100%;
    position: relative;
    .close-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
  }
  .card_wrap {
    padding: 24px;
    display: flex;
    flex-direction: column;
    min-height: 570px;
    .header {
      .title {
        font-weight: 600;
        font-size: 24px;
        line-height: 29px;
        letter-spacing: -0.02em;
      }
    }
    :deep(.content) {
      .col {
        &.date_col {
          .actions_wrap {
            display: flex;
          }
        }
        .label {
          font-weight: 600;
          font-size: 14px;
          line-height: 17px;
          margin-top: 24px;
          margin-bottom: 8px;
        }
      }
    }
    .footer {
      margin-top: auto;
    }
  }
}
</style>
