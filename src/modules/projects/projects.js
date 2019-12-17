import mongo from './apis';

const apiPath = '/api/projects';
let projectVal = '';
let deadlineVal = '';
let ownerVal = JSON.parse(localStorage.getItem('user')).id;

export const addProject = function(){
    $('.showhome').hide();
    $('.content').show();
    $.get('/src/modules/projects/templates/addProject.mst', function(template) {
        const result = Mustache.to_html(template);
        $('.content').html(result);
        afterAddProject();
    });
};

function afterAddProject(){
    console.log(ownerVal)
    document.getElementById('xSubmit').addEventListener('click', onSubmitClick);

    const project = document.getElementById('project');
    const deadline = document.getElementById('deadline');

    project.addEventListener('focusout', (e) => {
        console.log(e.target.value)
        projectVal = e.target.value
    })
    
    deadline.addEventListener('focusout', (e) => {
        console.log(e.target.value)
        deadlineVal = e.target.value;
    })

    populateList();
}

function onSubmitClick(e){
    e.preventDefault();
    e.stopPropagation();

    console.log(project, deadline)
    postRequest()

    $.get('/src/modules/projects/templates/viewProject.mst', function(project) {
        const template = "<div>{{project}}</div>"
        const result = Mustache.to_html(template);
        $('.content').html(result);
        postRequest(projectVal, deadlineVal, ownerVal);
    });
}

function populateList(){
    const grid = document.querySelector('grid');
    const projects = getRequest(ownerVal);

    //appending list items to grid column 2 with class="list"
}

async function postRequest(p, d, o){
    const obj = {
        name: p,
        owner: o,
        deadline: d
    }

    const body = {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj),
        method: 'POST'
    }

    console.log(body)
    try{
        const response = await mongo.post(apiPath, body);
    
        console.log('response - ', response);
    } catch(err){
        console.log('error - ', err)
    }
}

async function getRequest(ownerVal){
    try{
        const response = await mongo.get(`/${ownerVal}`);
        console.log(response);
    } catch(err){
        console.log(err);
    }
}