'use strict'

console.log('Starting up');

function initPage() {
    renderPortfolio();
}

function renderPortfolio() {
    var projs = getProjects();
    var strHTML = '<div class="row"><div class="col-lg-12 text-center"><h2 class="section-heading">Portfolio</h2><h3 class="section-subheading text-muted">A few of my works.</h3></div ></div ><div class="row"> ';
    var strArray = projs.map(proj => {
        return `<div class="col-md-4 col-sm-6 portfolio-item">
        <a class="portfolio-link ${proj.id}" onclick="updateModal('${proj.id}')" data-toggle="modal" href="#portfolioModal1">
          <div class="portfolio-hover">
            <div class="portfolio-hover-content">
              <i class="fa fa-plus fa-3x"></i>
            </div>
          </div>
          <img class="img-fluid" src="img/proj-pics/${proj.id}.png" alt="">
        </a>
        <div class="portfolio-caption">
          <h4>${proj.name}</h4>
          <p class="text-muted">${proj.title}</p>
        </div>
        </div>`
    });
    strHTML += strArray.join('') + '</div>'; //  had to do join() because .html() still added those "," seperators
    $('.bg-light .container').html(strHTML);
}

function renderModal(project) {
    var strHTML = `<h2>${project.name}</h2>
    <p class="item-intro text-muted">${project.title}</p>
    <img class="img-fluid d-block mx-auto" src="img/proj-pics/${project.id}.png" alt="">
    <p>${project.desc}</p>
    <ul class="list-inline">
    <li>Date: January 2017</li>
    <li>Client: Threads</li>
    <li>Category: ${project.labels}</li></ul><a target="_blank" href="${project.url}" class="mr-2 btn btn-primary btn-lg" tabindex="-1" role="button" aria-disabled="true">Check it out!</a><button class="btn btn-primary" data-dismiss="modal" type="button"><i class="fa fa-times"></i>Close Project</button>`;
    $('.modal-body').html(strHTML);
}

function updateModal(projID) {
    var project = getProjByID(projID);
    renderModal(project);
}

function openContactMe() {
    var subject = $('#subject').val();
    var message = $('#message').val();
    var email = $('#email').val();
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=rotemasdwe@gmail.com&su=${subject}&body=${message} \n ${email}`);
}
