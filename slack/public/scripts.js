const username = prompt('What is your username?')
const socket = io('http://localhost:8000', {
  query: {
    username
  }
});
let nsSocket = "";
// listen for nsList, which is a list of all the namespaces.
socket.on('nsList', (nsData) => {
  console.log("the list of namesapces has arrived");

  let namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" alt="namespace" /></div>`
  })

  // Add a clicklistener for each NS
  Array.from(document.getElementsByClassName('namespace')).forEach((elem, i) => {
    elem.addEventListener('click', (e) => {
      const nsEndpoint = elem.getAttribute('ns');
      joinNs(nsEndpoint);
    })
  });

  joinNs('/wiki')

})
