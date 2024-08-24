document.addEventListener("DOMContentLoaded", () => {
  // get dom elements
  const taskInputDOM = document.querySelector(".form-input");
  const formDOM = document.querySelector(".task-form");
  const tasksDOM = document.querySelector(".tasks");
  const loadingDOM = document.querySelector(".loading-text");
  const formAlertDOM = document.querySelector(".form-alert");

  // get all tasks
  const getAllTasks = async () => {
    loadingDOM.style.display = "block";
    try {
      const {
        data: { tasks },
      } = await axios.get("/api/v1/tasks");

      if (tasks.length < 1) {
        tasksDOM.innerHTML = "<h5 class='empty-list'>No tasks to display</h5>";
        loadingDOM.style.display = "none";
        return;
      }

      const allTasks = tasks.map((task) => {
        const { name, completed, _id: taskID } = task;
        return `
       <div class="single-task ${completed && "show-completed"}">
       <h5><span><i class="far fa-check-circle"></i></span> ${name}</h5>
       <div class="icons">
       <a href="edit.html?id=${taskID}" class="edit-icon">
       <i class="fas fa-edit"></i>
       </a>
       
       <span class="delete-icon" data-id=${taskID}>
       <i class="fas fa-trash"></i>
       </span>
       </div>
       </div>
       `;
      })
        .join("");
      tasksDOM.innerHTML = allTasks;
    } catch (error) {
      tasksDOM.innerHTML = `<h5>there was an error,please try again later...</h5>`;
    }
    loadingDOM.style.display = "none";
  };

  getAllTasks();

  // delete
  tasksDOM.addEventListener("click", async (e) => {
    const el = e.target;
    if (el.parentElement.classList.contains("delete-icon")) {
      loadingDOM.style.display = "block";
      const id = el.parentElement.dataset.id;
      try {
        await axios.delete(`/api/v1/tasks/${id}`);
        formAlertDOM.style.visibility = "visible";
        formAlertDOM.textContent = "Task Deleted 👍";
        formAlertDOM.classList.add("danger");
        getAllTasks();
      } catch (error) {
        console.log(error);
      }
    }
    loadingDOM.style.display = "none";
    setTimeout(() => {
      formAlertDOM.style.visibility = "hidden";
      formAlertDOM.classList.remove("danger");
    }, 2000);
  });

  // form submission
  formDOM.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = taskInputDOM.value;

    try {
      await axios.post("/api/v1/tasks", { name });
      getAllTasks();
      taskInputDOM.value = "";
      formAlertDOM.style.visibility = "visible";
      formAlertDOM.textContent = `success , task added 😁`;
      formAlertDOM.classList.add("success");
    } catch (error) {
      formAlertDOM.style.visibility = "visible";
      formAlertDOM.innerHTML = `error, please try again later..`;
    }

    setTimeout(() => {
      formAlertDOM.style.visibility = "hidden";
      formAlertDOM.classList.remove("success");
    }, 2000);
  });
});
