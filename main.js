
var apiKey = "6e2ac39490d68d8cee32b36012960fb0a3e39cfec2f17767e25323f7292f60ee"


//Load existing todos
var listRequest = new XMLHttpRequest();
listRequest.onreadystatechange = function() {
  if(this.readyState == 4 && this.status == 200) {

    var todos = JSON.parse(this.responseText);
    console.log(todos);
    //Display Todos on page
    for(var i = 0; i < todos.length; i++) {
      renderTodo(todos[i]);
    }

  }
  else if(this.readyState == 4) {
    console.log(this.responseText);
  }

}
listRequest.open("GET", "https://api.kraigh.net/todos", true);
listRequest.setRequestHeader("x-api-key", apiKey);
listRequest.send();




//Handle new To-do Form Submit
document.getElementById("new-todo-form").addEventListener("submit", function(event) {

  event.preventDefault(); //If there's a link that goes to google.com, Javascript will stop all default functions
  console.log(event);
  console.log(newTitle.value); //Prints out the value user typed in to the form.


  //Submit Todo to apiKey

  //Setting variable for form input
  var data = {
    text: newTitle.value
  }

  //Initialize AJAX request
  var createRequest = new XMLHttpRequest();

  //Response handler. This function gets called everytime readstate changes
  createRequest.onreadystatechange = function() {

    // Wait for readyState = 4 & 200 response
    //Ready State = 4 means response has been received, processed, and is ready to look at
    //Status = 200 means success
    if (this.readyState == 4 && this.status == 200) {

        // parse JSON response
        var todo = JSON.parse(this.responseText);
        renderTodo(todo);

    }
    else if (this.readyState == 4) {

        // this.status !== 200, error from server. To see what that error is, we log
        console.log(this.responseText);

    }
  };

  //Setting it to 'true' means we will do it asynchronously so it loads stuff in the background
  createRequest.open("POST", "https://api.kraigh.net/todos", true);

  createRequest.setRequestHeader("Content-type", "application/json");
  createRequest.setRequestHeader("x-api-key", apiKey);
  //Turning 'data' variable created above to be a string and send it to the server.
  createRequest.send(JSON.stringify(data));

});



function renderTodo(todoData) {
  console.log(todoData);

  //1. Create new Todo container
  var todo = document.createElement("li");


  //2. Add id of todo as id of container
  todo.setAttribute("id", todoData.id);
  todo.classList.add("todo");


  //3. Create complete button (checkbox)
  var completeButton = document.createElement("input");
  completeButton.setAttribute("type", "checkbox");
  completeButton.classList.add("check");
  completeButton.value = "";

  todo.appendChild(completeButton); //Add the new input element into the li element

  if(todoData.completed) {
    todo.classList.add("completed");
    completeButton.checked = true;
  }


  //4. Add todo text
  var todoText = document.createElement("span");
  todoText.setAttribute("id", "todo-text");
  // todoText.innerHTML = todoData.text; --> This is a bad idea never do this.
  todoText.innerText = todoData.text;
  todo.appendChild(todoText);


  //5. Create delete button
  var deleteButton = document.createElement("button");
  deleteButton.classList.add("close");
  deleteButton.setAttribute("type", "button");
  deleteButton.setAttribute("aria-label", "Close");
  //5.1 Creating a span for Bootstrap stuff
  var spanSection = document.createElement("span");
  spanSection.setAttribute("aria-hidden", "true");
  spanSection.innerText = "×";
  deleteButton.appendChild(spanSection);
  todo.appendChild(deleteButton);


  //6. Add todo to page
    //Appending the entire list to my id todos unordered list
  document.getElementById("todos").appendChild(todo);


  //7. Add event listeners for button
  completeButton.addEventListener("click", completeTodo);
  deleteButton.addEventListener("click", deleteTodo);

  //To clear out the form input after user type in a new Todo item
  document.getElementById("newTitle").value = "";

}



function completeTodo(event) {
  console.log(event);
  //Handle Todo Completion

  //API call, PUT to set completed to setRequestHeader
  //'parentNode' selects the parent div/section/element of that element
  var todoID = event.target.parentNode.id; //'target' is the actual element the event was called for (i.e. click, button)
  var data = {
    completed: true
  };

  var completeRequest = new XMLHttpRequest();
  completeRequest.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      event.target.parentNode.classList.add("completed");  //Add "completed" class
      event.target.checked = true;
    }
    else if (this.readyState == 4) {
      console.log(this.responseText);
    }
  }

  completeRequest.open("PUT", "https://api.kraigh.net/todos/" + todoID, true);
  completeRequest.setRequestHeader("Content-type", "application/json");
  completeRequest.setRequestHeader("x-api-key", apiKey);
  //Turning 'data' variable created above to be a string and send it to the server.
  completeRequest.send(JSON.stringify(data));

}



//Handle Todo deletion
function deleteTodo(event) {

  var todoID = event.currentTarget.parentNode.id; //'target' is the actual element the event was called for (i.e. click, button)
  console.log("Delete button is clicked");
  console.log(todoID);

  //API call, DELETE to remove

  var deleteRequest = new XMLHttpRequest();

  deleteRequest.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      event.target.parentNode.parentNode.remove();
    }
    else if (this.readyState == 4) {
      console.log(this.responseText);
    }
  }

  deleteRequest.open("DELETE", "https://api.kraigh.net/todos/" + todoID, true);
  deleteRequest.setRequestHeader("Content-type", "application/json");
  deleteRequest.setRequestHeader("x-api-key", apiKey);
  deleteRequest.send();

  //Event listener on button click


  //Remove from page

}



function check(event) {
  event.target.input.checked = true;
  //document.getElementsByClassName("check").checked = true;
}

function uncheck() {
    document.getElementsByClassName("check").checked = false;
}



//Things that are not working
//DELETE reques is not allowed by Access-Control-Allow-Methods
//How to check the checkbox for the input section I created??? How to select it?
