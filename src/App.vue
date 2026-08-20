<script>

import $ from 'jquery'

const NB_MAX_ROOMS=4;
const NB_MAX_ADULT=4;
const NB_MAX_CHILD=3;
const NB_MAX_BABY=2;

export default {
  name: "App",
  data() {
    return {
        occupations:[{indexRoom:1, nbAdult:2, nbChild: 0,nbBaby: 0, error: false}],
        seenWait: false,
        error: false,
        messageError:'',
        roomsList:[],
        pensionTypes:[],
        nbNights:0,
        totalPrice:0,
        emptyList: true,
        step: 1,
        roomChecked: [],
        checkIn:'',
        checkOut: '',
        info:{
          title: 1,
          firstname:'',
          lastname: '',
          email: '',
          phone: ''
        },
        infoOccup:[],
        errFirstname:'',
        errLasttname:'',
        errEmail: '',
        errPhone: '',
        num_res:''
    };
  },
  watch: {
    step() {
      this.updateStepIHM();
    },
  },
  computed: {
    emptyFirstname: function () { $('#firstname').focus();return this.info.firstname === "" },
    emptyLastname: function () { $('#lastname').focus();return this.info.lastname === "" },
    emptyEmail: function () { $('#email').focus();return this.info.email === "" },
    emptyPhone: function () { $('#phone').focus();return this.info.phone === "" },
  },
  methods: {
    updateStepIHM(){
      $("#step"+this.step).addClass("disabled");
      $("#textStep"+this.step).addClass("text-step-disabled");

    },
    addRoom() {
      // Vérifier si le nombre des chambres ajouté atteind le nombre maximale des chambres
        if(this.occupations.length>=NB_MAX_ROOMS){
            if(!$("#addRoomBloc").hasClass("hidden")){
                $("#addRoomBloc").addClass("hidden");
                $("#addRoomBloc").removeClass("visible");
            }
            return;
        }
        let indexRoom=1;
        // Déterminer l'indice de la chambre
        for(var i=1; i<5; i++){
            let column = "indexRoom";
            let rowIndex = -1;
            $.each(this.occupations, (index, row) => {
                if (row[column] == i) {
                    rowIndex=index;
                    return;
                }
            });
            if(rowIndex === -1){
                indexRoom=i;
                break;
            }
        }
        // Ajouter une chambre
        this.occupations.push({indexRoom:indexRoom, nbAdult:2, nbChild: 0,nbBaby: 0, error: false});

        if(this.occupations.length==NB_MAX_ROOMS){
          // Masquer le bloc d'ajout de chambre
            if(!$("#addRoomBloc").hasClass("hidden")){
                $("#addRoomBloc").addClass("hidden");
                $("#addRoomBloc").removeClass("visible");
            }
        }else{
            // Afficher le bloc d'ajout de chambre
            if(!$("#addRoomBloc").hasClass("visible")){
                $("#addRoomBloc").addClass("visible");
                $("#addRoomBloc").removeClass("hidden");
            }
        }
        this.occupations.sort((a, b) => a.indexRoom - b.indexRoom);
    },
    toggleSelection() {

        if ($("#divSelection").hasClass("display-block")) {
          // Masquer le bloc de chambre et occupation
          $("#divSelection").removeClass("display-block");
          $("#divSelection").addClass("display-none");
        } else {
          // Afficher le bloc de chambre et occupation
          $("#divSelection").addClass("display-block");
          $("#divSelection").removeClass("display-none");
        }

          this.updateTotalRooms();
    },
    hideSelection() {
        // Masquer le bloc de chambre et occupation
        if ($("#divSelection").hasClass("display-block")) {
            $("#divSelection").removeClass("display-block");
            $("#divSelection").addClass("display-none");
        }
        this.updateTotalRooms();
    },
    removedRoom(pIndex) {
        let column = "indexRoom";
        let rowIndex = -1;
        // Chercher la chambre à supprimer
        $.each(this.occupations, (index, row) => {
            if (row[column] == pIndex) {
                rowIndex=index;
                return;
            }
        });
        // Supprimer la chambre
        if(rowIndex != -1){
            this.occupations.splice(rowIndex, 1);
        }
        if(this.occupations.length==NB_MAX_ROOMS){
            // Masquer le bloc ajouter chambre
            if(!$("#addRoomBloc").hasClass("hidden")){
                $("#addRoomBloc").addClass("hidden");
                $("#addRoomBloc").removeClass("visible");
            }
        }else{
            // Afficher le bloc ajouter chambre
            if(!$("#addRoomBloc").hasClass("visible")){
                $("#addRoomBloc").addClass("visible");
                $("#addRoomBloc").removeClass("hidden");
            }
        }
    },
      updateTotalRooms(){
        let nbRooms = this.occupations.length;
        let nbAdult = 0;
        let nbChild = 0;
        let nbBaby = 0;
        // Construire bloc chambre et occupations
        for(var i=0; i<this.occupations.length; i++){
            nbAdult +=this.occupations[i].nbAdult;
            nbChild   +=this.occupations[i].nbChild;
            nbBaby  +=this.occupations[i].nbBaby;
        }
        let totalRoomSpan = `
            <span class="rooms-hotel" title="Chambres">${nbRooms}</span>
            <span class="text-room" title="Chambres">chambre${nbRooms>1 ? "s":""}</span>
        `
        if(nbAdult>0){
            totalRoomSpan+=`
                ,<span class="adult" title="Adultes">${nbAdult}</span>
                <span class="text-adt" title="Adultes">adulte${nbAdult>1 ? "s":""}</span>
            `
        }
        if(nbChild>0){
            totalRoomSpan+=`
            ,<span class="child" title="Enfants">${nbChild}</span>
            <span class="text-child" title="Enfants">enfant${nbChild>1 ? "s":""}</span>
            `
        }
        if(nbBaby>0){
            totalRoomSpan+=`
            ,<span class="baby" title="Lits bébé">${nbBaby}</span>
            <span class="text-baby" title="Lits bébé">bébé${nbBaby>1 ? "s":""}</span>
            `
        }
        $('#totalRooms').html('');
        $('#totalRooms').html(totalRoomSpan);
      },
      calculateNbNights() {
          let dateIn = new Date(this.checkIn);
          let dateOut = new Date(this.checkOut);

          let diffTime = dateOut - dateIn;
          let diffDays = diffTime / (1000 * 60 * 60 * 24);

          return diffDays;
      },
      checkDateFields(){
        const today = new Date().toISOString().split("T")[0];
          if(this.checkIn===''){
          this.error = true;
          this.messageError = "Veuillez sélectionner une date d’arrivée.";
          return;
        }
        if(this.checkOut===''){
          this.error = true;
          this.messageError = "Veuillez sélectionner une date de départ.";
          return;
        }
        if (new Date(this.checkIn) < new Date(today)) {
            this.error = true;
            this.messageError = "La date d’arrivée doit être supérieure ou égale à la date du jour.";
            return;
        }
        this.nbNights = this.calculateNbNights();
        if (this.nbNights<=0) {
            this.error = true;
            this.messageError = "La date de départ doit être postérieure à la date d’arrivée.";
            return;
        }
      },
      getData(){
        this.emptyList=true;
        this.roomsList=[];
        let error = false;
        this.error=false;
        this.messageError='';
        // Contrôle des champs
        this.checkDateFields();
        if(this.error){
        return;
        }
        
        for(var i=0; i<this.occupations.length; i++){
          if(this.occupations[i].nbAdult===0 && this.occupations[i].nbChild===0 && this.occupations[i].nbBaby===0){
            this.occupations[i].error=true;
            error=true;
          }
        }
        if(this.occupations.length==0 || error){
          if(!$("#divSelection").hasClass("display-block")) {
              $("#divSelection").removeClass("display-none");
              $("#divSelection").addClass("display-block");
            }
        return;
        }
        // Payload
        let  payload = {check_in:'', check_out:'', occupations:[]}
        payload.check_in = this.checkIn;
        payload.check_out = this.checkOut;
        for(let i=0; i<this.occupations.length; i++){
          payload.occupations.push({
            "nb_adult": this.occupations[i].nbAdult,
            "nb_child": this.occupations[i].nbChild,
            "nb_baby": this.occupations[i].nbBaby
          })
        }
        this.seenWait = true;
        this.error    = false;
        this.messageError = '';
        // Appel de l'api availability
        var request = $.ajax({
          url: "http://localhost:8000/api/room/availability/",
          method: "POST",
          data: JSON.stringify(payload),
          contentType: "application/json",
          dataType: "json"
        });
        // Success
        request.done((data, textStatus, jqXHR) => {
          try{
            this.seenWait = false;

            if (jqXHR.status === 200) { // OK
              if(data.length!=0){
                this.roomsList = data;
                this.emptyList = false;

              }
              // Mettre à jour le prix  total
              this.updatePrice();
            } else { // NOK
              this.error = true;
              this.messageError = 'Une erreur est survenue. Merci de réessayer ultérieurement.';
              console.log("status : "+jqXHR.status )
              return false;
              
            }
          }
          catch(e) {  // Exception
            this.error = true;
            this.messageError ='Une erreur est survenue. Merci de réessayer ultérieurement.'; 
            this.seenWait=false;
            console.log("error : "+e)
          }
        });
        // Fail
        request.fail((xhr) => {
            this.error = true;
            this.messageError ='Une erreur a été rencontrée. Merci de réessayer ultérieurement';
            console.log("Api error : "+xhr.responseText) 
            this.seenWait=false;
        });
        return false;
      },
      updatePrice(){
        // Raz prix total
        this.totalPrice = 0;

        for(var i=0; i<this.roomsList.length; i++){
          if(this.roomsList[i].checked){
            this.totalPrice += parseFloat(this.roomsList[i].room_price)*this.nbNights;
            if(this.roomsList[i].type_pension_price!=undefined){
              this.totalPrice += parseFloat(this.roomsList[i].type_pension_price)*this.nbNights;
            }
          }
        }
      },
      checkedRoom(pIndex, pChecked){
        let column = "index_res";
        let rowIndex = -1;
        // Chercher la ligne de chambre
        $.each(this.roomsList, (index, row) => {
            if (row[column] == pIndex) {
                rowIndex=index;
                return;
            }
        });

        if(rowIndex != -1){
          if(pChecked==undefined){
            this.roomsList[rowIndex].checked=true;
          }else{
            this.roomsList[rowIndex].checked=!pChecked;
          }
        }
        this.updatePrice();
      },
      getPensionTypes(pIndex){
        this.seenWait = true;
        this.error=false;
        this.messageError='';
        this.pensionTypes=[];
        // Appel de l'api pension types
          var request = $.ajax({
            url: "http://localhost:8000/api/pension-type/",
            method: "GET",
          });
          // Success
          request.done((data, textStatus, jqXHR) => {
            try{
              this.seenWait = false;

              if (jqXHR.status === 200) { // OK
                if(data.length!=0){
                  this.pensionTypes = data;
                }
                this.getData();
              } else { // NOK
                this.error = true;
                this.messageError = 'Une erreur est survenue. Merci de réessayer ultérieurement.';
                console.log("status : "+jqXHR.status )
                return false;
                
              }
            }
            catch(e) { // Exception
              this.error = true;
              this.messageError ='Une erreur est survenue. Merci de réessayer ultérieurement.'; 
              this.seenWait=false;
              console.log("error : "+e)
            }
          });
          // Fail
          request.fail((xhr) => {
              this.error = true;
              this.messageError ='Une erreur a été rencontrée. Merci de réessayer ultérieurement';
              console.log("Api error : "+xhr.responseText) 
              this.seenWait=false;
          });
          return false;

      },
      getCurrentTypePension(pIndex){
        
        let column = "index_res";
        let rowIndex = -1;
        // Chercher la ligne de chambre 
        $.each(this.roomsList, (index, row) => {
            if (row[column] == pIndex) {
                rowIndex=index;
                return;
            }
        });

        if(rowIndex != -1){
          this.roomsList[rowIndex].type_pension_price = 0;
          // Chercher le type pension
          for(let i=0; i<this.pensionTypes.length; i++){
            if(this.roomsList[rowIndex].type_pension_id==this.pensionTypes[i].id){
              this.roomsList[rowIndex].type_pension_price = this.pensionTypes[i].price;
            }
          }
          // Mettre à jour le prix total
          if(this.roomsList[rowIndex].checked){
            this.updatePrice();
          }
        }
      },
      nextStep(){
        switch(this.step) {
          case 1:
            this.roomChecked=[];
            this.infoOccup=[];
            this.error=false;
            this.messageError ='';

            for(var i=0; i<this.roomsList.length; i++){
              if(this.roomsList[i].checked){
                this.roomChecked.push(this.roomsList[i]);
              }
            }
            // Contrôle des champs
            this.checkDateFields()
            if(this.error){
              return;
            }
            // Contôle de nombre de chambres cochées
            if(this.roomChecked.length===0){
              this.error = true;
              this.messageError = "Veuillez cocher au moins une chambre.";
              return false;
            }
            // Vérifier le nombre de chambres cochées
            let nbRoomChecked=0
            for(var i=0; i<this.roomChecked.length; i++){
              nbRoomChecked+=this.roomChecked[i].room_nb;
            }

            if (nbRoomChecked>this.occupations.length){
              this.error = true;
              this.messageError = "Le nombre de chambres cochées est supérieur au nombre de chambres sélectionnées.";
              return false;
            }
            // remplir le tableau info occupation
            for(var i=0; i<this.roomChecked.length; i++){
              let room_passagers = [];
              
              for(var j=0; j<this.roomChecked[i].room_nb; j++){
                let passagers = [];
                let room_id=0;
                for(var k=0; k<this.roomChecked[i].nb_adult; k++){
                  let passager = {title: 1, firstname: '',lastname: '',type: 'Adulte', errFirstname: '', errLasttname: ''};
                  passagers.push(passager);
                }
                for(var l=0; l<this.roomChecked[i].nb_child; l++){
                  let passager = {title: 1, firstname: '',lastname: '',type: 'Child', errFirstname: '', errLasttname: ''};
                  passagers.push(passager);
                }
                if (this.roomChecked[i].room_ids.length >= j){
                  room_id   = this.roomChecked[i].room_ids[j];
                }
                room_passagers.push({room_id: room_id, nb_adult:this.roomChecked[i].nb_adult, nb_child:this.roomChecked[i].nb_child, nb_baby:this.roomChecked[i].nb_baby, passagers: passagers})
              }
              let infoOccup = {room_nb: 0, room_type:0, room_type_id: 0, type_pension_id:0, room_passagers: []};
              infoOccup.room_nb          = this.roomChecked[i].room_nb;
              infoOccup.room_type        = this.roomChecked[i].room_type;
              infoOccup.room_type_id     = this.roomChecked[i].room_type_id;
              infoOccup.type_pension_id  = this.roomChecked[i].type_pension_id;
              infoOccup.room_passagers = room_passagers;
              this.infoOccup.push(infoOccup);
            }
            // Modifier l'étape
            this.step = 2;

            break;
          case 2:
            this.errFirstname='';
            this.errLasttname='';
            this.errEmail='';
            this.errPhone='';
            let error = false;
            // initialisation de messages d'erreur
            for(var i=0; i<this.infoOccup.length; i++){
              for(var j=0; j<this.infoOccup[i].room_passagers.length; j++){
                for(var k=0; k<this.infoOccup[i].room_passagers[j].passagers.length; k++){
                  this.infoOccup[i].room_passagers[j].passagers[k].errFirstname = '';
                  this.infoOccup[i].room_passagers[j].passagers[k].errLasttname = '';
                }
              }
            }
            // Contrôle des champs
            if (this.emptyFirstname ){
              this.errFirstname = "Le prénom est obligatoire";
              return;
            }
            if (this.emptyLastname ){
              this.errLasttname = "Le nom est obligatoire";
              return;
            }
            if (this.emptyEmail ){
              this.errEmail = "L´email est obligatoire";
              return;
            }
            if(!this.isEmail(this.info.email)){
              this.errEmail = "Veuillez renseigner une adresse e-mail valide."
              $('#email').focus();
              return;
            }
            if (this.emptyPhone ){
              this.errPhone = "Le numéro de téléphone mobile est obligatoire.";
              return;
            }
            for(var i=0; i<this.infoOccup.length; i++){
              for(var j=0; j<this.infoOccup[i].room_passagers.length; j++){
              for(var k=0; k<this.infoOccup[i].room_passagers[j].passagers.length; k++){
                if(this.infoOccup[i].room_passagers[j].passagers[k].firstname===''){
                  this.infoOccup[i].room_passagers[j].passagers[k].errFirstname = "Le prénom est obligatoire";
                  error=true;
                }
                if(this.infoOccup[i].room_passagers[j].passagers[k].lastname===''){
                  this.infoOccup[i].room_passagers[j].passagers[k].errLasttname = "Le nom est obligatoire";
                  error=true;
                }
              }
              }
            }
            if(error){
              return;
            }
            // Iitialisation des attributs
            this.seenWait = true;
            this.error    = false;
            this.messageError = '';
            // Payload
            let  payload = {check_in:'', check_out:'',nb_nights:0, info:{}, infoOccup:[]}
            payload.check_in = this.checkIn;
            payload.check_out = this.checkOut;
            payload.nb_nights = this.nbNights;
            payload.info      = this.info;
            payload.infoOccup = this.infoOccup;

            // Appel de l'api reservation
            var request = $.ajax({
              url: "http://localhost:8000/api/room/reservation/",
              method: "POST",
              data: JSON.stringify(payload),
              contentType: "application/json",
              dataType: "json"
            });
            // Success
            request.done((data, textStatus, jqXHR) => {
              try{
                this.seenWait = false;
                if (jqXHR.status === 201) { // OK
                  this.num_res = "RES_"+data.id;
                  this.step = 3;
                } else {// NOK
                  this.error = true;
                  this.messageError = 'Une erreur est survenue. Merci de réessayer ultérieurement.';
                  console.log("status : "+jqXHR.status )
                  return false;
                  
                }
              }
              catch(e) { // Exception
                this.error = true;
                this.messageError ='Une erreur est survenue. Merci de réessayer ultérieurement.'; 
                this.seenWait=false;
                console.log("error : "+e)
              }
            });
            // Fail
            request.fail((xhr) => {
                this.error = true;
                this.messageError ='Une erreur a été rencontrée. Merci de réessayer ultérieurement';
                console.log("Api error : "+xhr.responseText) 
                this.seenWait=false;
            });
            
            break;
          case 3:
            
            break;
          default: 
        }
        return false;
      },
      previousStep(){
        this.step--;
      },
      isEmail: function (email)  {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
      },
      handleInput(event,pType) {
        let id  = event.target.id;
        let val = event.target.value;
        switch(pType) {
          case 1: // texte
            val = val.replace(/[^a-zA-Z\s]/g, '');
            break;

          case 2: // number
              val = val.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
            break;

          default:
            
        }
        $("#"+id).val(val);
        return false;
    },
  },
  created() {
    
  },
  mounted() {
    this.updateTotalRooms();
  }
  }
</script>

<template>
  <div class="container">
    <div class="app" v-cloak>
      <section class="bg-success py-2 d-none d-sm-block">
        <div class="container">
          <!-- Steps -->
          <div class="row align-items-center">
            <div class="col-4 d-flex">
              <div id="step1" class="btn btn-light rounded-pill disabled">
                <span class="color-secondary">01</span>
              </div>
              <div id="textStep1" class="ms-2 align-self-center text-step-disabled">
                Sélection
              </div>
            </div>
            <div class="col-4 d-flex">
              <div id="step2" class="btn btn-light rounded-pill">
                <span class="color-secondary">02</span>
              </div>
              <div id="textStep2" class="ms-2 align-self-center text-step">
                Coordonnées
              </div>
            </div>
            <div class="col-4 d-flex">
              <div id="step3" class="btn btn-light rounded-pill">
                <span class="color-secondary">03</span>
              </div>
              <div id="textStep3" class="ms-2 align-self-center text-step">
                Confirmation
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Step 1 -->
      <div id="content-step1" v-if="step===1">
        <div class="container">
        <section class="room-section">
            <div class="room-selection mt-4">
              <form>
                <div class="card shadow border-0 rounded-0">
                  <div class="card-body">
                    <div class="row">

                      <!-- Date d'arrivée -->
                      <div class="col-md-2 p-2 m-auto">
                        <div class="position-relative t-05r">
                          <div class="form-group">
                            <label for="checkIn" class="mb-2 color-text-m"
                              >Arrivée</label
                            >
                            <div id="divCheckin" class="input-group mb-3">
                              <input
                                name="checkIn"
                                id="checkIn"
                                v-model="checkIn"
                                type="date"
                                class="form-control bg-white bl-0 h-40 pl-0 fs-16"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Date de départ -->
                      <div class="col-md-2 p-2 m-auto">
                        <div class="position-relative t-05r">
                          <div class="form-group">
                            <label for="checkOut" class="mb-2 color-text-m"
                              >Départ</label
                            >
                            <div id="divCheckout" class="input-group mb-3">
                              <input
                                name="checkOut"
                                id="checkOut"
                                v-model="checkOut"
                                type="date"
                                class="form-control bg-white bl-0 h-40 pl-0 fs-16"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Chambre et occupation -->
                      <div class="col-md-4 p-2 m-auto">
                        <div class="position-relative">
                          <div class="form-group">
                            <label class="mb-2 color-text-m" for="occup">
                              Chambre et occupation
                            </label>
                            <div class="occup" id="occup">
                              <span class="guests-span">
                                <div class="guests-select">
                                  <div class="form-control h-40 fs-16">
                                   <font-awesome-icon icon="user" class="pr-1 color-primary" />
                                    <span id="totalRooms"></span>
                                    <font-awesome-icon icon="chevron-down" class="float-end lh-24 cursor-pointer" title="Modifier occupation" @click="toggleSelection()" />
                                  </div>
                                </div>
                                <div
                                  class="guests display-none"
                                  id="divSelection"
                                  tabindex="0"
                                  @blur="hideSelection()"
                                >
                                  <div
                                    class="border-bottom mb-2 pb-2 d-flex justify-content-space-between"
                                  >
                                    <span class="align-self-center color-text-m"
                                      >Sélection des chambres et des passagers</span
                                    >
                                    <span
                                      class="cursor-pointer"
                                      @click="toggleSelection()"
                                      ><i
                                        class="fa-solid fa-circle-xmark ml-auto color-secondary"
                                      ></i
                                    ></span>
                                  </div>
    
                                  <Room
                                    v-for="item in occupations"
                                    :key="'room_'+item.indexRoom"
                                    :occupation="item"
                                    @delete-room="removedRoom($event)"
                                   />
    
                                  <div class="footer-occup pt-2">
                                    <div class="row align-items-center">
                                      <div
                                        class="col-8 align-self-center visible"
                                        id="addRoomBloc"
                                      >
                                        <a
                                          class="add add-room color-secondary cursor-pointer"
                                          @click="addRoom()"
                                          >
                                          <font-awesome-icon icon="plus-circle" class="pr-1" />
                                          Ajouter une chambre</a
                                        >
                                      </div>
                                      <div class="col-md-4 text-end">
                                        <button
                                          class="btn btn-valider rounded-0"
                                          type="button"
                                          @click="toggleSelection()"
                                        >
                                          Valider
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Vérifier la disponibilité -->
                      <div class="col-md-3 p-2 m-auto">
                        <div class="position-relative t-1r">
                          <button
                            type="button"
                            class="btn btn-secondary display-block w-100p"
                            @click="getPensionTypes()"
                          >
                            Vérifier la disponibilité
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
        
        </section>
    
        <section class="result-section">
          <div class="container">
            <div class="text-center mb-3 flex-center mt-1r">
              <!--wait-->
                <div class="sk-circle" id="wait_search_step_1" v-if="seenWait">
                  <div class="sk-circle1 sk-child"></div>
                  <div class="sk-circle2 sk-child"></div>
                  <div class="sk-circle3 sk-child"></div>
                  <div class="sk-circle4 sk-child"></div>
                  <div class="sk-circle5 sk-child"></div>
                  <div class="sk-circle6 sk-child"></div>
                  <div class="sk-circle7 sk-child"></div>
                  <div class="sk-circle8 sk-child"></div>
                  <div class="sk-circle9 sk-child"></div>
                  <div class="sk-circle10 sk-child"></div>
                  <div class="sk-circle11 sk-child"></div>
                  <div class="sk-circle12 sk-child"></div>
                </div>
              <!-- Alert -->
              <div
                class="alert alert-danger no-border mb-2 data-multilangue mt-3r"
                data-label=""
                role="alert"
                id="alerterror"
                v-if="error"
              >
                <strong>
                  <font-awesome-icon icon="exclamation-triangle" />
                  </strong
                >{{messageError}}
              </div>
            </div>
            <!-- Liste de chambres -->
            <div id="results" class="mt-3r" v-if="!emptyList" >
              <form>
                <div>
                  <div class="lst-rooms">
                    <div
                      class="display-block bg-yellow px-3 py-2 fw-600 color-white border-bottom-lst"
                    >
                      <div class="row">
                        <div class="col-md-5">Type de chambre</div>
                        <div class="col-md-2">Occupation</div>
                        <div class="col-md-3">Type de pension</div>
                        <div class="col-md text-end">Total {{ nbNights }} nuit<span v-if="nbNights>1">s</span></div>
                      </div>
                    </div>
                    <Res
                      v-for="item in roomsList"
                      :key="'room_detail'+item.id"
                      :detail="item"
                      :pension-types="pensionTypes"
                      @ckeck-room="checkedRoom($event,item.checked)"
                      @get-type-pension="getCurrentTypePension($event)"
                    />
    
                    <div class="lstFoot border-top p-3">
                      <div class="lstTot row">
                        <div class="col-md-10 text-end fw-600">
                          Montant total du séjour :
                          <span class="fs-22 ml-1r">{{ totalPrice }} €</span>
                        </div>
                        <div class="text-end col-md-2">
                          <!--  Bouton Réserver -->
                          <button
                            type="button"
                            class="btn btn-primary cursor-pointer"
                            @click="nextStep()"
                          >
                            Réserver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      </div>
      <!-- Step 2 -->
      <div id="content-step2" v-if="step===2">
        <div class="container">
          <div class="text-center mb-3 flex-center mt-1r">
            <!--wait-->
              <div class="sk-circle" id="wait_search_step_2" v-if="seenWait">
                <div class="sk-circle1 sk-child"></div>
                <div class="sk-circle2 sk-child"></div>
                <div class="sk-circle3 sk-child"></div>
                <div class="sk-circle4 sk-child"></div>
                <div class="sk-circle5 sk-child"></div>
                <div class="sk-circle6 sk-child"></div>
                <div class="sk-circle7 sk-child"></div>
                <div class="sk-circle8 sk-child"></div>
                <div class="sk-circle9 sk-child"></div>
                <div class="sk-circle10 sk-child"></div>
                <div class="sk-circle11 sk-child"></div>
                <div class="sk-circle12 sk-child"></div>
              </div>
            <!-- Alert -->
            <div
              class="alert alert-danger no-border mb-2 data-multilangue"
              data-label=""
              role="alert"
              id="alerterror"
              v-if="error"
            >
              <strong
                ><font-awesome-icon icon="exclamation-triangle" /></strong
              >{{messageError}}
            </div>
          </div>
          <div class="row mt-2r">
            <div class="col-md-8">
              <form>
                <div class="card shadow mb-4 bg-transparent" id="info">
                  <div class="card-body">
                    <div class="mb-3">
                      <!--  Vos informations-->
                      <h2 class="h3">Vos informations</h2>
                      <div class="hl-1"></div>
                      <!-- Title -->
                      <div class="d-flex flex-row mb-2">
                        <div class="pr-1">
                          <label class="content-radio">
                            <input
                              type="radio"
                              name="title"
                              id="mr"
                              class=""
                              value="1"
                              v-model="info.title"
                            />
                            Mr
                          </label>
                        </div>
                        <div class="pr-1">
                          <label class="content-radio">
                            <input
                              type="radio"
                              name="title"
                              id="mme"
                              class=""
                              value="2"
                              v-model="info.title"
                            />
                            Mme
                          </label>
                        </div>
                        <div class="pr-1">
                          <label class="content-radio">
                            <input
                              type="radio"
                              name="title"
                              id="mlle"
                              class=""
                              value="3"
                              v-model="info.title"
                            />
                            Mlle
                          </label>
                        </div>
                      </div>
    
                      <div class="row g-3">
                        <!-- Prénom -->
                        <div class="col-6">
                          <div class="form-group">
                            <label for="firstname"> Prénom* </label>
                            <input
                              id="firstname"
                              name="firstname"
                              placeholder="Prénom"
                              value=""
                              class="form-control"
                              type="text"
                              v-model="info.firstname"
                              @input="handleInput($event,1)"
                            />
                            <small
                              class="color-danger-light"
                              v-if="errFirstname!=''"
                              >{{ errFirstname }}</small
                            >
                          </div>
                        </div>
                        <!-- Nom -->
                        <div class="col-6">
                          <div class="form-group">
                            <label for="lastname"> Nom* </label>
                            <input
                              id="lastname"
                              name="lastname"
                              class="form-control"
                              placeholder="Nom de famille"
                              value=""
                              type="text"
                              v-model="info.lastname"
                              @input="handleInput($event,1)"
                            />
                            <small
                              class="color-danger-light"
                              v-if="errLasttname!=''"
                              >{{ errLasttname }}</small
                            >
                          </div>
                        </div>
                        <!-- E-mail -->
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="email">E-mail* </label>
                            <input
                              id="email"
                              name="email"
                              class="form-control"
                              placeholder="E-mail"
                              value=""
                              type="email"
                              v-model="info.email"
                            />
    
                            <small class="color-danger-light" v-if="errEmail!=''"
                              >{{ errEmail }}<br
                            /></small>
                            <small
                              >(Pour y recevoir votre e-mail de confirmation)
                            </small>
                          </div>
                        </div>
                        <!-- Mobile -->
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="phone">Mobile*</label>
                            <input
                              id="phone"
                              name="phone"
                              placeholder="Mobile"
                              class="form-control"
                              type="text"
                              autocomplete="off"
                              v-model="info.phone"
                              @input="handleInput($event,2)"
                            />
                            <small class="color-danger-light" v-if="errPhone!=''"
                              >{{ errPhone }}<br
                            /></small>
                            <small>(Pour vous contacter si besoin) </small>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    <div class="mb-3">
                      <!-- Informations sur l'occupation -->
                      <h2 class="h3">Informations sur l'occupation</h2>
                      <div class="hl-1"></div>
    
                      <p class="mb-2 h6">
                        Reportez un nom de famille et un prénom tels qu'ils figurent
                        sur votre passeport
                      </p>
                      <div class="roomPassager" v-for="(item,index) in infoOccup">
                        <p class="color-primary fw-600 mb-3 h6">
                          {{ item.room_nb }} x {{ item.room_type }}
                          <span class="ml-2"
                            ><span class="badge badge-success">Disponible</span>
                          </span>
                        </p>
                        <!-- Passagers -->
                        <div class="row mb-2">
                          <div class="col-md-2 col-4">
                            <label>Civilité</label>
                          </div>
                          <div class="col-md-4 col-4">
                            <label> Prénom </label>
                          </div>
                          <div class="col-md-4 col-4">
                            <label> Nom </label>
                          </div>
                          <div class="col">
                            <label> Type </label>
                          </div>
                        </div>
                        <div
                          class="room-detail"
                          v-for="(item1,index1) in item.room_passagers"
                        >
                        <div v-for="(item2,index2) in item1.passagers">
                       
                          <div class="row mb-3">
                            <!-- Title -->
                            <div class="col-md-2">
                              <div class="form-group">
                                <select
                                  :name="'title_'+index+index1+index2"
                                  class="form-select"
                                  :id="'title_'+index+index1+index2"
                                  v-model="item2.title"
                                >
                                  <option value="1">Mr</option>
                                  <option value="2">Mme</option>
                                  <option value="3">Mlle</option>
                                </select>
                              </div>
                            </div>
                            <!-- Prénom -->
                            <div class="col-md-4">
                              <div class="form-group">
                                <input
                                  type="text"
                                  class="form-control"
                                  :id="'firstname_'+index+index1+index2"
                                  :name="'firstname_'+index+index1+index2"
                                  placeholder="Prénom"
                                  v-model="item2.firstname"
                                  @input="handleInput($event,1)"
                                />
                                <small
                                  class="color-danger-light"
                                  v-if="item2.errFirstname!=''"
                                  >{{ item2.errFirstname }}</small
                                >
                              </div>
                            </div>
                            <!-- Nom -->
                            <div class="col-md-4">
                              <div class="form-group">
                                <input
                                  type="text"
                                  class="form-control"
                                  :id="'lastname_'+index+index1+index2"
                                  :name="'lastname_'+index+index1+index2"
                                  placeholder="Nom de famille"
                                  v-model="item2.lastname"
                                  @input="handleInput($event,1)"
                                />
                                <small
                                  class="color-danger-light"
                                  v-if="item2.errLasttname!=''"
                                  >{{ item2.errLasttname }}</small
                                >
                              </div>
                            </div>
                            <div class="col">
                              <span>{{ item2.type }}</span>
                            </div>
                          </div>
                           </div>
                        </div>
                      </div>
                    </div>
    
                    <!--Mode de paiement -->
                    <div class="mb-3" id="mode_payement">
                      <h2 class="h3">Paiement en ligne</h2>
                      <div class="hl-1"></div>
                      <div class="alert alert-danger mb-md-4 mb-3 h6" role="alert">
                        <p>
                          Paiement sécurisé par Carte Bancaire en ligne -
                          <strong>montant total : [{{ totalPrice }} €] </strong>
                        </p>
                      </div>
                    </div>
                    <!-- END Mode de paiement -->
    
                    <div class="row">
                      <div class="col-md-6">
                        <div class="display-none">
                          <button
                            type="button"
                            @click="previousStep()"
                            class="btn btn-light rounded-0"
                          >
                            Retour
                          </button>
                        </div>
                      </div>
                      <!-- Confirmation de réservation -->
                      <div class="col-md-6 col-12 text-end">
                        <button
                          type="button"
                          class="btn btn-primary display-block w-100p rounded-0 color-white"
                          @click="nextStep()"
                        >
                          Confirmer votre réservation
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <!-- END  -->
    
            <!-- Détails de réservation -->
            <div class="col-md-4">
              <div class="display-block" id="detailRes">
                <div class="card shadow mb-md-3 bg-transparent">
                  <div class="card-body">
                    <h3 class="h4">Détails de votre réservation</h3>
    
                    <div class="row">
                      <div class="col-md-12 mb-3">
                        <img
                          src='./assets/ban.jpg'
                          class="max-w-100p h-auto"
                          alt="Réservation Hotel"
                        />
                      </div>
                      <div class="col-md-12">
                        <div class="d-flex mb-2">
                          Date d'arrivée :<span class="ms-auto fw-600"
                            >{{ checkIn }}</span
                          >
                        </div>
                        <div class="d-flex mb-2">
                          Date départ :
                          <span class="ms-auto fw-600">{{ checkOut }}</span>
                        </div>
                        <div class="d-flex mb-2">
                          Nombre de nuits :<span class="ms-auto fw-600"
                            >{{ nbNights }} nuit<span v-if="nbNights>1">s</span></span
                          >
                        </div>
                      </div>
                    </div>
    
                    <div class="bg-light p-3 border-top color-white">
                      <p class="h4">Détail Tarifs</p>
                      <div class="selectedRoom" v-for="item in roomChecked">
                        <div>
                          <span>Chambre : </span
                          ><span>{{ item.room_nb }} x {{ item.room_type }}</span>
                        </div>
                        <div class="mt-2">
                          <span>Occupation :</span>
                          <span
                            >&nbsp;{{ item.nb_adult }} adulte<span v-if="item.nb_adult>1">s</span>
                          </span>
                          <span v-if="item.nb_child>0">
                            &nbsp;,{{ item.nb_child }} enfant<span v-if="item.nb_child>1">s</span >
                          </span>
                          <span  v-if="item.nb_baby>0"
                            >&nbsp;,{{ item.nb_baby }} bébé<span v-if="item.nb_baby>1">s</span></span
                          >
                        </div>
                        <div class="d-flex justify-content-between my-2">
                          <div>Sous total :</div>
                          <div class="font-weight-600">{{ item.room_price*nbNights }} €</div>
                        </div>
                      </div>
                    </div>
    
                    <div class="d-flex justify-content-between mt-3">
                      <div class="align-self-center h6">Montant Total</div>
                      <div class="price-tot fw-600 font-22 h6">
                        {{ totalPrice }} €
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Step 3 -->
      <div id="content-step3" v-if="step===3">
        <div class="container">
          <div class="row mt-2r">
            <div class="col-md-12 flex-center h-6r">
              <p class="h4 color-success">
                Votre réservation a été envoyée sous N° {{num_res}}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
