let modalVisible=false;
let allFilters = document.querySelectorAll(".filter");
    let addbtn=document.querySelector(".add");
    let body=document.querySelector("body");
    let grid=document.querySelector(".filter-grid");
    let container=document.querySelector(".container");
    let deletestate=false;
    let deletebtn=document.querySelector(".delete");
    let uid = new ShortUniqueId();
    
    //initialization 
    if(!localStorage.getItem("tasks"))
    {
        localStorage.setItem("tasks",JSON.stringify([]));
    }

    for(let i=0;i<allFilters.length;i++)
    {

    
    allFilters[i].addEventListener("click",function(e)
    {
      if(e.currentTarget.classList.contains("selected-filters")){
        e.currentTarget.classList.remove("selected-filters");
        loadTasks();
      }
      else{
        let color=e.currentTarget.classList[1];
        e.currentTarget.classList.add("selected-filters");
        
        loadTasks(color);
      }
    });
  }
    deletebtn.addEventListener("click",function(e)
    {
        if(deletestate){
            deletestate=false;
            e.currentTarget.classList.remove("delete-state");
           
        }
        else{
            deletestate=true;
            e.currentTarget.classList.add("delete-state");
           

        }
    });
   
    addbtn.addEventListener("click",function()
    {        
      let blur = document.getElementById('blur');
      blur.classList.toggle('active');
  
              if(modalVisible){
                    
                    return;
              }
              if(deletebtn.classList.contains("delete-state"))
              {
                  deletebtn.classList.remove("delete-state");
                  deletestate=false;
                
              }
              container.classList.add("is-blured");
              addbtn.classList.add("selected-filters");
              
              let modal=document.createElement("div");
              modal.classList.add("modal-container");
              modal.setAttribute("click-first",true);
              modal.innerHTML=`<div class="writing-area" contenteditable>Enter the details!!</div>
                          <div class="filter-area">
                              <div class="filter-modal priority p"><i class="material-icons">priority_high</i></div>
                              <div class="filter-modal reading r "><i class="material-icons">chrome_reader_mode</i></div>
                              <div class="filter-modal todos t active-modal-filter"><i class="material-icons">check</i></div>
                              <div class="filter-modal journals j"><i class="material-icons">library_books</i></div>   
                              <div class="save"></div> 
                          </div>`;
              
              let wa=modal.querySelector(".writing-area");
              
              wa.addEventListener("click",function(e){
                  if(modal.getAttribute("click-first")=="true")
                  {
                      wa.innerHTML="";
                      modal.setAttribute("click-first",false);
                  }
              });
              let allmodalfilter=modal.querySelectorAll(".filter-modal");
              for(let i=0;i<allmodalfilter.length;i++)
              {   allmodalfilter[i].addEventListener("click",function(e)
              {
                for(let j=0;j<allmodalfilter.length;j++)
                  {
                      allmodalfilter[j].classList.remove("active-modal-filter");

                  }
                  e.currentTarget.classList.add("active-modal-filter");
              });
              }


              let savebtn=modal.querySelector(".save");
              savebtn.addEventListener("click",function()
              {
                
                
                  let task = wa.innerText;
                  let selectedModalFilter = document.querySelector(".active-modal-filter");
                  let color = selectedModalFilter.classList[2];
                  
              
              
                 let id=uid();

                  let ticket = document.createElement("div")
                  ticket.classList.add("ticket")
                  ticket.innerHTML = `<div class="ticket-color ${color}"></div>
                    <div class="ticket-id">#${id}</div>
                    <div class="ticket-box" contenteditable>
                      ${task}
                    </div>
                  </div>`;
    
                  saveTicketInLocalStorage(id,color,task);
                
                  
                  let ticketwriingarea=ticket.querySelector(".ticket-box");
                  ticketwriingarea.addEventListener("input",function(e){
                  let ID=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split('#')[1];
                  let taskarr=JSON.parse(localStorage.getItem("tasks"));
                  let reqindex=-1;
                  for(let i=0;i<taskarr.length;i++)
                  {
                      if(taskarr[i].id==ID)
                      {
                          reqindex=i;
                      }
                      break;
                  } 
                  taskarr[reqindex].task=e.currentTarget.innerText;
                  localStorage.setItem("tasks",JSON.stringify(taskarr));
                  });
                  ticket.addEventListener("click", function (e) {
                      if (deletestate) {
                        let id = e.currentTarget
                          .querySelector(".ticket-id")
                          .innerText.split("#")[1];
              
                        let tasksArr = JSON.parse(localStorage.getItem("tasks"));
              
                        tasksArr = tasksArr.filter(function (el) {
                          return el.id != id;
                        });
              
                        localStorage.setItem("tasks", JSON.stringify(tasksArr));
              
                        e.currentTarget.remove();
                      }
                    });
              
    
                grid.appendChild(ticket)
                modal.remove()
                modalVisible = false
                blur.classList.toggle('active');

              })
        
              
              body.appendChild(modal);
              modalVisible=true;  
              addbtn.classList.remove("selected-filters");
              container.classList.remove("is-blured");
    });

    function saveTicketInLocalStorage(id, color, task) {
        let requiredObj = { id, color, task };
        let tasksArr = JSON.parse(localStorage.getItem("tasks"));
        tasksArr.push(requiredObj);
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
      }
      
    let names={
      p:"color",
      r:"reading-list",
      t:"task",
      j:"journal",
    }
      function loadTasks(passedColor) {
        //agr koi ticket ui pr pehle se hai use remove kr rhe hai
        let allTickets = document.querySelectorAll(".ticket");
        for (let t = 0; t < allTickets.length; t++) allTickets[t].remove();
      
        let tasks = JSON.parse(localStorage.getItem("tasks"));
        for (let i = 0; i < tasks.length; i++) {
          let id = tasks[i].id;
          let color = tasks[i].color;
          let taskValue = tasks[i].task;
          let val=names[color];
        
          if (passedColor) {
            if (passedColor != names[color]) continue;
          }
      
          let ticket = document.createElement("div");
          ticket.classList.add("ticket");
          ticket.innerHTML = `<div class="ticket-color ${color}"></div>
                <div class="ticket-id">#${id}</div>
                <div class="ticket-box" contenteditable>
                  ${taskValue}
                </div>
                </div>`;
                let ticketwriingarea=ticket.querySelector(".ticket-box");
                ticketwriingarea.addEventListener("input",function(e){
                let ID=e.currentTarget.parentElement.querySelector(".ticket-id").innerText.split('#')[1];
                let taskarr=JSON.parse(localStorage.getItem("tasks"));
                let reqindex=-1;
                for(let i=0;i<taskarr.length;i++)
                {
                    if(taskarr[i].id==ID)
                    {
                        reqindex=i;
                    }
                    break;
                } 
                taskarr[reqindex].task=e.currentTarget.innerText;
                localStorage.setItem("tasks",JSON.stringify(taskarr));
                });
      
          ticket.addEventListener("click", function (e) {
            if (deletestate) {
              let id = e.currentTarget
                .querySelector(".ticket-id")
                .innerText.split("#")[1];
      
              let tasksArr = JSON.parse(localStorage.getItem("tasks"));
      
              tasksArr = tasksArr.filter(function (el) {
                return el.id != id;
              });
      
              localStorage.setItem("tasks", JSON.stringify(tasksArr));
      
              e.currentTarget.remove();
            }
          });
      
          grid.appendChild(ticket);
        }
      }
      
     
      //refresh/ app re-open
      loadTasks();
      