<script>

import $ from 'jquery'

const NB_MAX_ROOMS=4;
const NB_MAX_ADULT=4;
const NB_MAX_CHILD=3;
const NB_MAX_BABY=2;

export default {
  name: "Room",
  props: ["occupation"],
  methods: {
    handleInput(event) {
        let id  = event.target.id;
        let nb = event.target.value;
        nb     = nb.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        if(id.includes("Adult")){
            if(nb>NB_MAX_ADULT){
                nb=0;
            }
            this.occupation.nbAdult=nb;
          }else if(pId.includes("Child")){
            if(nb>NB_MAX_CHILD){
              nb=0;
            }
            this.occupation.nbChild=nb;
          }else if(pId.includes("Baby")){
            if(nb>NB_MAX_BABY){
              nb=0;
            }
            this.occupation.nbBaby=nb;
        }
        $("#"+id).val(nb);
    },
    decrementer(pId) {
        let nb = $("#"+pId).val();
        nb--;
        if(nb<=0){
            nb=0;
        }
        if(pId.includes("Adult")){
          this.occupation.nbAdult=nb;
        }else if(pId.includes("Child")){
          this.occupation.nbChild=nb;
        }else if(pId.includes("Baby")){
          this.occupation.nbBaby=nb;
        }
        $("#"+pId).val(nb);
    },
    incrementer(pId) {
        let nb = $("#"+pId).val();
        if(pId.includes("Adult")){
            if(nb>=NB_MAX_ADULT){
                return;
            }else{
                nb++
                this.occupation.nbAdult=nb;
                $("#"+pId).val(nb);
            }
        }else if(pId.includes("Child")){
            if(nb>=NB_MAX_CHILD){
                return;
            }else{
                nb++
                this.occupation.nbChild=nb;
                $("#"+pId).val(nb);
            }
        }else if(pId.includes("Baby")){
            if(nb>=NB_MAX_BABY){
                return;
            }else{
                nb++
                this.occupation.nbBaby=nb;
                $("#"+pId).val(nb);
            }
        }
    },
    deleteRoom(pIndex) {
        $('#room'+pIndex).remove();
        this.$emit("delete-room", pIndex);
    },
}
}
</script>

<template>
  <div class="room" :id="'room'+occupation.indexRoom" >
  <div class="room-item row">
    <div class="form-group color-secondary col-12 mt-2 mb-2" >
      <label>Chambre {{ occupation.indexRoom }} <font-awesome-icon icon="exclamation-triangle" class="color-danger" v-if="occupation.error" /></label>
    </div>
    <!-- Adultes -->
    <div class="input-group adults row h-55">
      <label class="text-dark col-5" >Adulte(s)</label>
      <div class="input-nb col-7">
        <div class="mr--1">
          <a class="btn btn-nb btn-nb-left" type="button" @click="decrementer('nbAdultRoom'+occupation.indexRoom)" >
            <font-awesome-icon icon="minus" class="color-black" />
          </a>
        </div>
        <input :id="'nbAdultRoom'+occupation.indexRoom" type="text" maxlength=1 class="form-control border-radius-0 nb-person" v-model="occupation.nbAdult" @input="handleInput()" />
        <div class="ml--2">
          <a class="btn btn-nb btn-nb-right" type="button" @click="incrementer('nbAdultRoom'+occupation.indexRoom)" >
            <font-awesome-icon icon="plus" class="color-black" />
          </a>
        </div>
      </div>
    </div>
    <!-- Children -->
    <div class="input-group children row h-55">
      <label class="text-dark col-5" >Enfant(s) <br />
        <span class="text-italic">(2-11 ans)</span>
      </label>
      <div class="input-nb col-7">
        <div class="mr--1">
          <a class="btn btn-nb btn-nb-left" type="button" @click="decrementer('nbChildRoom'+occupation.indexRoom)" >
            <font-awesome-icon icon="minus" class="color-black" />
          </a>
        </div>
        <input :id="'nbChildRoom'+occupation.indexRoom" type="text" maxlength=1 class="form-control border-radius-0 nb-person" v-model="occupation.nbChild" @input="handleInput()" />
        <div class="ml--2">
          <a class="btn btn-nb btn-nb-right" type="button" @click="incrementer('nbChildRoom'+occupation.indexRoom)" >
            <font-awesome-icon icon="plus" class="color-black" />
          </a>
        </div>
      </div>
    </div>
    <!-- babies -->
    <div class="input-group babies row h-55">
      <label class="text-dark col-5">Lit(s) bébé<br />
        <span class="text-italic">(inf à 2 ans)</span>
      </label>
      <div class="input-nb col-7">
        <div class="mr--1">
          <a class="btn btn-nb btn-nb-left" type="button" @click="decrementer('nbBabyRoom'+occupation.indexRoom)" >
            <font-awesome-icon icon="minus" class="color-black" />
          </a>
        </div>
        <input :id="'nbBabyRoom'+occupation.indexRoom" type="text" maxlength=1 class="form-control border-radius-0 nb-person" v-model="occupation.nbBaby" @input="handleInput()" />
        <div class="ml--2">
          <a class="btn btn-nb btn-nb-right" type="button" @click="incrementer('nbBabyRoom'+occupation.indexRoom)" >
            <font-awesome-icon icon="plus" class="color-black" />
          </a>
        </div>
      </div>
    </div>
    <!-- Delete room -->
    <div class="delete-room" v-if="occupation.indexRoom>1" >
      <a class="del text-danger" @click="deleteRoom(occupation.indexRoom)">
        <font-awesome-icon icon="trash-alt" />
      </a>
    </div>
  </div>
</div>
</template>