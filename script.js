// lightweight interactions for the landing page
document.addEventListener('DOMContentLoaded', function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('newsletter-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const email = form.querySelector('input[name=email]').value;
      // fake submit: show success message
      const btn = form.querySelector('button');
      btn.disabled = true; btn.textContent = 'Subscribed';
      setTimeout(()=>{btn.disabled=false;btn.textContent='Subscribe';form.reset()},3000);
      console.log('newsletter signup:', email);
    })
  }
});
