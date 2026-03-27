(()=>{
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const taxSwitch = document.getElementById("taxSwitch");

taxSwitch.addEventListener("change", () => {
  const prices = document.querySelectorAll(".price");

  prices.forEach((priceEl) => {
    const basePrice = Number(priceEl.dataset.price);

    if (taxSwitch.checked) {
      const withTax = Math.round(basePrice * 1.18); // 18% GST
      priceEl.innerText = `₹ ${withTax} / night (incl. tax)`;
    } else {
      priceEl.innerText = `₹ ${basePrice} / night`;
    }
  });
});
