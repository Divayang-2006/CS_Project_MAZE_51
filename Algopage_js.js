
function copyCode(id) {
   const codeElement = document.getElementById(id);
   const code = codeElement.textContent;

   navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
   }).catch(err => {
      console.error('Failed to copy code: ', err);
   });
}