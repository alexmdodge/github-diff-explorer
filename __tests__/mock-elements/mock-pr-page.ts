/**
 * TODO: Add a pre-processor to the Jest configuration to allow
 *       loading html as strings.
 */

export default `
<div class="container new-discussion-timeline experiment-repo-nav">
  <div class="tabnav tabnav-pr">
    <nav class="tabnav-tabs">
      <a href="/files/location/url" class="tabnav-tab selected js-pjax-history-navigate">
        Files changed
        <span id="files_tab_counter" class="Counter">
          4
        </span>
      </a>
    </nav>
  </div>

  <div id="files" class="diff-view commentable">
    <div class="js-diff-progressive-container">
      <a name="diff-aaa111"></a>
      <div id="diff-0" class="file js-file js-details-container js-targetable-element Details show-inline-notes">
        <div class="file-header js-file-header" data-path="test-file1.js" data-short-path="testabc1" data-anchor="diff-aaa111">
          <span> Diff view header</span>
        </div>
        <div class="js-file-content Details-content--shown">
          <div>Diff view content</div>
        </div>
      </div>

      <a name="diff-bbb222"></a>
      <div id="diff-1" class="file js-file js-details-container js-targetable-element Details show-inline-notes">
        <div class="file-header js-file-header" data-path="test-file2.js" data-short-path="testabc2" data-anchor="diff-bbb222">
          <span> Diff view header</span>
        </div>
        <div class="js-file-content Details-content--shown">
          <div>Diff view content</div>
        </div>
      </div>
    </div>

    <!--
    Currently GitHub will load the first number of diff views in the first container, then async retrieve
    the rest.
    -->
    <div class="js-diff-progressive-container">
      <a name="diff-ccc333"></a>
      <div id="diff-3" class="file js-file js-details-container js-targetable-element Details show-inline-notes">
        <div class="file-header js-file-header" data-path="test-file3.js" data-short-path="testabc3" data-anchor="diff-ccc333">
          <span> Diff view header</span>
        </div>
        <div class="js-file-content Details-content--shown">
          <div>Diff view content</div>
        </div>
      </div>

      <a name="diff-ddd444"></a>
      <div id="diff-4" class="file js-file js-details-container js-targetable-element Details show-inline-notes">
        <div class="file-header js-file-header" data-path="test-file4.js" data-short-path="testabc4" data-anchor="diff-ddd444">
          <span> Diff view header</span>
        </div>
        <div class="js-file-content Details-content--shown">
          <div>Diff view content</div>
        </div>
      </div>
    </div>
  </div>
</div>
`