<script>

import $ from 'jquery'

const NB_MAX_ROOMS=4;
const NB_MAX_ADULT=4;
const NB_MAX_CHILD=3;
const NB_MAX_BABY=2;

export default {
  name: "Res",
  props: ["detail", "pensionTypes"],
  methods: {
    checkRoom(pIndex, pChecked) {
      this.$emit("ckeck-room", pIndex, pChecked);
  },
  getTypePension(pIndex){
    this.$emit("get-type-pension",pIndex);
  },
  }
}
</script>

<template>
<div class="item-room p-3">
    <div class="row">
      <div class="col-md-5 align-self-center">
        <div class="mb-2">
          <label>
          <input
              class="checkLst"
              type="checkbox"
              value=""
              :checked="detail.checked"
              @click="checkRoom(detail.index_res,detail.checked)"
            />
            </label>&nbsp;&nbsp; {{ detail.room_nb }} x {{ detail.room_type }}
          <span class="badge badge-success">{{ detail.available_room_nb }} Disponible</span>
        </div>
      </div>
      <div class="col-md-2 align-self-center">
        <span v-for="n in detail.nb_adult" :key="n" >
          <font-awesome-icon icon="male" class="mr-025r fa-lg" />
        </span>
        <span v-for="n in detail.nb_child" :key="n" >
          <font-awesome-icon icon="child" class="mr-025r fa-lg" />
        </span>
        <span v-for="n in detail.nb_baby" :key="n" >
          <font-awesome-icon icon="baby" class="mr-025r fa-lg" />
        </span>
      </div>
      <div class="col-md-3 col-7 align-self-center">
        <select class="form-select fs-14 selected" name="pension-1" v-model="detail.type_pension_id" @change="getTypePension(detail.index_res)" >
          <option v-for="item in pensionTypes" :value="item.id" :key="item.id" >{{ item.name }}</option>
        </select>
      </div>
      <div class="text-end col-md-2 col-5 price fw-600 fs-1r" :value="detail.room_price">{{detail.room_price}} €</div>
    </div>
  </div>
</template>
