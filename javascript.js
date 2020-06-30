const form = document.getElementById("form");

const titulo = document.getElementById("titulo");

const select = document.getElementById("selectPrioridad");

const fileInput = document.getElementById("customFileLang");


const listaTareas = document.getElementById("listaTareas");
const tareasF = document.getElementById("tareasFz");
const tFz = document.getElementById("tareasFinal");

const divLista = document.getElementById("divListaTareas");
const btnAdd = document.getElementById("add");





////drag and drop
const eliminar = document.getElementById("eliminar");




/////////

addEventListener("load",()=>{
      titulo.focus();
});








///////////indexDB

const indexDB = window.indexedDB;

if(indexedDB && form){
	let db;
	let request = indexedDB.open("listaTareas",1);

   request.onsuccess =()=>{
        db = request.result;
        readTarea();
   }

   request.onupgradeneeded = ()=>{
   	     db = request.result;
        

        const objectStore = db.createObjectStore("tareas",{
            keyPath: "titulo"
        });


   }

   request.onerror = (error)=>{
   	console.log('Error',error);
   }
  
/////leer datos de la db
const readTarea =()=>{
     
 const transaction = db.transaction(["tareas"]);

 const objectStore = transaction.objectStore("tareas");

 const request = objectStore.openCursor();

 const fragment = document.createDocumentFragment();



 request.onsuccess= (e)=>{

  const cursor = e.target.result;

  if(cursor){

          const card = document.createElement("div")
          card.classList.add("card","bg-dark", "mt-4","text-white", "text-center");
          

          const cardHeader= document.createElement("div");
          cardHeader.classList.add("card-header");
          cardHeader.classList.add("cardHeader");
          cardHeader.textContent = cursor.value.titulo;
          card.appendChild(cardHeader);

          const cardBody = document.createElement("div");
          cardBody.classList.add("card-body");
          cardBody.classList.add("cardBody");
          cardBody.textContent = `Prioridad: ${cursor.value.prioridad}`;


         const btnEditar = document.createElement("button");
         btnEditar.textContent = "Editar Tarea";
         btnEditar.classList.add("btn","btn-primary","ml-4");
         
         btnEditar.dataset.type = "update";
         btnEditar.dataset.key = cursor.key;


         const btnEliminar = document.createElement("button");
         btnEliminar.textContent = "Eliminar Tarea";
         btnEliminar.classList.add("btn","btn-danger","ml-4");

         btnEliminar.dataset.type = "delete";
         btnEliminar.dataset.key = cursor.key;


         cardBody.appendChild(btnEditar);
         cardBody.appendChild(btnEliminar);

           

          card.appendChild(cardHeader);
          card.appendChild(cardBody);

          fragment.appendChild(card);



       
    cursor.continue();

  } else{
    divLista.textContent = "";
    divLista.appendChild(fragment);
  
      }

    }



}
    

///obtener datos en el formulario
const getTarea =(key)=>{

      const transaction = db.transaction(["tareas"],"readwrite");

      const objectStore = transaction.objectStore("tareas");

      const request = objectStore.get(key); 

      request.onsuccess = ()=>{
         form.titulo.value = request.result.titulo;
         form.prioridad.value = request.result.prioridad;
         form.agregar.dataset.action ="update";
      }


}



///actualizar datos
const updateTarea = (tarea)=>{
   
 const transaction = db.transaction(["tareas"], "readwrite");

 const objectStore = transaction.objectStore("tareas");

 const request = objectStore.put(tarea);
 readTarea();  

}




//// insertar datos en la db
  const addTarea =(tarea)=>{
     
 const transaction = db.transaction(["tareas"], "readwrite");

 const objectStore = transaction.objectStore("tareas");

 const request = objectStore.add(tarea);
 readTarea();



  }
     

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    
         
          const tarea = {

             titulo: e.target.titulo.value,
             prioridad: e.target.prioridad.value
          }





if(e.target.agregar.dataset.action == "add"){
     addTarea(tarea);
}else if(e.target.agregar.dataset.action == "update"){
     updateTarea(tarea);
}
   



         form.reset();
         titulo.focus();


});

divLista.addEventListener("click",(e)=>{
  if(e.target.dataset.type =="update"){
         getTarea(e.target.dataset.key);
  }
   
});

}



