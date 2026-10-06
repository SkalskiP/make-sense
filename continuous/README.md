# Local continuous YOLO26 learning

The browser edits labels; a Python service on localhost:8765 owns reviewed data,
training jobs and history. No data goes to a hosted annotation service.

## Start

Use the GPU Python environment that ran the YOLO26s pilot. Install
`python -m pip install -r continuous/requirements.txt` if needed. Configure CUDA
PyTorch separately for your machine. Copy `config.example.json` to a location outside
the repository and fill in absolute paths. Then run from the Make Sense checkout:

```bash
python continuous/server.py --config /absolute/path/to/project.json
# Another terminal:
npm start -- --host 127.0.0.1 --strictPort
```

The current implementation uses an existing local image folder, not browser uploads.
The seed dataset must contain manifest.json with image, split and sha256 fields,
plus labels/train and labels/val in YOLO format. The four class names/order must
match the starting checkpoint. Each project needs a separate storage directory;
configuration changes require a new directory. Use one service and one browser editor
per project. Preserve that storage directory and original images for recovery/history.

## Preannotation pipeline

```
inference (latest YOLO checkpoint) → draft boxes → you correct them →
every edited image becomes ground truth → 10 new training reviews
trigger fine-tuning → the new model re-predicts untouched images
```

- **Run preannotation inference**: predicts all untouched, unreviewed images with
  the latest checkpoint (the newest completed run, or the seed checkpoint when no
  run exists yet). Uses `POST /infer`; the panel sends batches of 25 and shows a
  live progress bar with image counts. Returns 409 while training runs.
- **Sidebar checkmarks**: green means the image is approved ground truth saved on
  the service; blue means the image has annotations but is not yet reviewed. Marks
  appear as soon as you connect and update live when you save a review.
- Drafts are applied only to images you have never edited: unreviewed, with boxes
  unchanged since connecting. Your edits and server-reviewed images are never
  overwritten. Image SHA-256 must match before any box is applied.
- **Ground truth rule**: any image you change counts as ground truth. Pressing the
  panel's ← Previous / Next → saves the edited image to the service before leaving
  it; **Mark reviewed / save corrections** saves immediately. An empty image can be
  saved as a true negative. Saving ten distinct new/revised training images triggers
  one run. Repeated saves of an unchanged image do not advance the counter.
- **Load run boxes into editor**: pick a completed run and load its boxes for the
  current image into the editor for correction. Loaded boxes are marked as your
  edit, so they are protected from automatic refresh and saved as ground truth on
  review. **Compare current image** remains read-only side-by-side history.
- Training uses all saved training reviews plus frozen seed validation labels. It
  starts from the previous completed checkpoint (or the initial YOLO26s checkpoint),
  trains ten epochs by default, then predicts the configured image collection.
  Successful predictions automatically refresh loaded, untouched, unreviewed images;
  the active image is skipped until you leave it. Reviews received during training
  stay pending for the next batch. Only one job runs at a time. Failed/interrupted
  jobs retain reviews and require **Train now / retry**.

## Review loop

1. Export any open annotations before refreshing the browser for this UI update.
2. Open **YOLO26 learning → Connect local training service**. Confirm the project name.
   The dev server usually runs at http://127.0.0.1:3000; when that port is busy,
   Vite moves to http://127.0.0.1:3001.
3. Existing browser boxes are protected initially. If they are unreviewed drafts,
   click **Allow refresh of current unreviewed drafts**. This explicitly clears local
   edit protection for unreviewed images; do not use it on work you want to preserve.
4. Optionally click **Run preannotation inference** to draft boxes for all untouched
   unreviewed images with the latest model.
5. Correct an image. Your edit is ground truth: leaving via the panel's ←/→ arrows
   saves it automatically, or click **Mark reviewed / save corrections** any time.
6. Every ten distinct new/revised training-image reviews triggers one run. Repeat
   saves of an unchanged image do not advance the counter; repeated edits of one
   pending image count only once. Bottom-bar arrows navigate without saving, so use
   the panel arrows or the review button to persist ground truth.
8. Review loop shortcuts: the bottom bar shows per-image manual/AI counts with
   **Skip** (next unreviewed) and **✓ Approve & Next** (key `A`); `Q` temporarily
   hides all boxes without changing them, both Delete and Backspace delete the
   selected box. Plain arrow keys still pan the viewport; use Ctrl/Cmd+arrows for
   strict dataset-order navigation.
7. To revisit history, select a run under **Load previous preannotations** and click
   **Load run boxes into editor**, then correct and save.

A saved reviewed image can be edited and saved again. The UI's saved-review label
means a server snapshot exists; save again after further edits. Frozen validation
images, matching acquisition dates (site/year/date filename prefix), and identical
validation-image hashes cannot enter training. This filename grouping is specific to
this cargo dataset; adapt it before using unrelated naming schemes.

## Historical comparison

Every run has a unique ID and is kept under storage/runs/ID:

- snapshot.json: exact reviewed boxes, revisions, source hashes, configuration, parent checkpoint.
- dataset/: image links and fixed YOLO labels used for that run.
- train/: best/last checkpoints, training history, plots, and settings.
- predictions.json: predictions, scores and source image hashes for every project image.
- result.json and worker.log: validation metrics and full job output.

Select two completed runs in **Run history**, then **Compare current image** for
read-only side-by-side box overlays. This does not change your current annotations.
Predictions for reviewed images are retained for comparison but never automatically
applied. Class aliases `chassy` and `spare tyre` map to `chassis` and `spare_tyre`.

state.json persists the review queue and latest completed run. Jobs publish results
only after both training and full prediction succeed. No runs are automatically deleted;
monitor free disk space. A process lock prevents overlapping GPU workers after a service
restart. The active browser project still needs regular annotation exports: unsaved
browser edits are not persisted by this service.

Validation metrics are visible per run. Completion promotes a model even if its
validation score falls; this is an experiment loop, not a quality-gated deployment.
The small seed validation set is reused across runs and is not an independent test set.

## Checks

```bash
python -m unittest discover -s continuous -p 'test_*.py'
npm test -- --runInBand src/logic/__tests__/render/RectMovement.test.ts
npm run build
```
