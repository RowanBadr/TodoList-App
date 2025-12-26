window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");

    const apiEndpoint = 'http://localhost:3000';


   
    async function getCurrentUserId() {
       
        return 'user-123';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const task = input.value;
        if (!task) return;

        const userId = await getCurrentUserId(); // Get the current user's ID

        const taskData = {
            title: task,
            description: '',
            dueDate: '',
            priority: '',
            tags: [],
            userId
        };

        try {
            const response = await fetch(`${apiEndpoint}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });

            const result = await response.json();

            if (response.ok) {
                const task_el = createTaskElement(result);
                list_el.appendChild(task_el);
                input.value = '';
            } else {
                console.error('Error creating task:', result.error);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    });

    function createTaskElement(task) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const task_content_el = document.createElement('div');
        task_content_el.classList.add('content');

        task_el.appendChild(task_content_el);

        const task_input_el = document.createElement('input');
        task_input_el.classList.add('text');
        task_input_el.type = 'text';
        task_input_el.value = task.title;
        task_input_el.setAttribute('readonly', 'readonly');

        task_content_el.appendChild(task_input_el);

        const task_actions_el = document.createElement('div');
        task_actions_el.classList.add('actions');

        const task_edit_el = document.createElement('button');
        task_edit_el.classList.add('edit');
        task_edit_el.innerText = 'Edit';

        const task_delete_el = document.createElement('button');
        task_delete_el.classList.add('delete');
        task_delete_el.innerText = 'Delete';

        task_actions_el.appendChild(task_edit_el);
        task_actions_el.appendChild(task_delete_el);

        task_el.appendChild(task_actions_el);

        task_edit_el.addEventListener('click', async () => {
            if (task_edit_el.innerText.toLowerCase() === "edit") {
                task_edit_el.innerText = "Save";
                task_input_el.removeAttribute("readonly");
                task_input_el.focus();
            } else {
                task_edit_el.innerText = "Edit";
                task_input_el.setAttribute("readonly", "readonly");

                // Update task in backend
                const updatedTaskData = {
                    title: task_input_el.value,
                    description: '',
                    dueDate: '',
                    priority: '',
                    tags: []
                };

                try {
                    const response = await fetch(`${apiEndpoint}/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedTaskData)
                    });

                    if (!response.ok) {
                        const result = await response.json();
                        console.error('Error updating task:', result.error);
                    }
                } catch (error) {
                    console.error('Error updating task:', error);
                }
            }
        });

        task_delete_el.addEventListener('click', async () => {
            // Delete task from backend
            try {
                const response = await fetch(`${apiEndpoint}/tasks/${task.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    list_el.removeChild(task_el);
                } else {
                    const result = await response.json();
                    console.error('Error deleting task:', result.error);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        });

        return task_el;
    }

    // Function to load tasks for the current user
    async function loadTasks() {
        const userId = await getCurrentUserId(); // Get the current user's ID

        try {
            const response = await fetch(`${apiEndpoint}/tasks?userId=${userId}`);
            const tasks = await response.json();

            if (response.ok) {
                tasks.forEach(task => {
                    const task_el = createTaskElement(task);
                    list_el.appendChild(task_el);
                });
            } else {
                console.error('Error loading tasks:', tasks.error);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    // Load tasks for the current user on page load
    loadTasks();
});
