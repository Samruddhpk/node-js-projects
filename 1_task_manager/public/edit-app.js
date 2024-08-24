const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const completedDOM = document.querySelector(".task-edit-completed");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");

const editBtnDOM = document.querySelector(".task-edit-btn");

// params
const params = window.location.search;

const id = new URLSearchParams(params).get("id");

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/v1/tasks/${id}`);
    const { _id: taskID, name, completed } = task;
    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;
    if (completed) {
      completedDOM.checked = true;
    }
  } catch (error) {
    console.log(error);
  }
};

showTask();

// edit

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();

  try {
    const taskName = taskNameDOM.value;
    const taskCompleted = completedDOM.checked;

    const {
      data: { task },
    } = await axios.patch(`/api/v1/tasks/${id}`, {
      name: taskName,
      completed: taskCompleted,
    });

    const { _id: taskID, completed, name } = task;
    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    tempName = name;

    if (completed) {
      completedDOM.checked = true;
    }
    formAlertDOM.style.visibility = "visible";
    formAlertDOM.textContent = "success, edited task";
    formAlertDOM.classList.add("success");
  } catch (error) {
    console.log(error);
    taskNameDOM.value = tempName;
    formAlertDOM.style.visibility = "visible";
    formAlertDOM.innerHTML = "error,please try again later...";
  }

  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.visibility = "hidden";
    formAlertDOM.classList.remove("success");
  }, 3000);
});
