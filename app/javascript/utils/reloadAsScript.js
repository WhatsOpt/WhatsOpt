import $ from 'jquery';

// Re-request the current page as JavaScript (Rails *.js.erb view) and run it.
//
// Since jQuery 4, a plain $.getScript() on the same origin is loaded through a
// <script> tag which cannot send the "Accept: text/javascript" header: Rails then
// answers with HTML, which the browser refuses to execute (nosniff).
// Setting a header forces the XHR transport; X-Requested-With is also required by
// Rails to serve JavaScript to GET requests (cross-origin embedding protection).
export default function reloadAsScript(callback) {
  return $.ajax({
    url: window.location.href,
    dataType: 'script',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    success: callback,
  });
}
