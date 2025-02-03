# first get back to master
git checkout master

# copy all necessary files
git checkout origin/cdc -- src/index.html
git checkout origin/cdc -- src/favicon.ico
git checkout origin/cdc -- src/app/global.config.ts

# git checkout origin/tricity -- src/app/authenification/signin/signin.component.scss

    ## css and renders
git checkout origin/cdc -- src/app/@theme/layouts/one-column/one-column.layout.scss
git checkout origin/cdc -- src/app/@theme/components/header/header.component.scss
git checkout origin/cdc -- src/app/pages/alert/alert-dialog/alert-dialog.const.ts
git checkout origin/cdc -- src/app/pages/alert/alert-form/alert-form.const.ts
git checkout origin/cdc -- src/app/pages/alert/alert.component.scss
git checkout origin/cdc -- src/app/pages/alert/alert-details/alert-details.component.scss
git checkout origin/cdc -- src/app/pages/historical/comparator/form-comparator/form-comparator.const.ts
git checkout origin/cdc -- src/app/pages/historical/details/details.const.ts
git checkout origin/cdc -- src/app/pages/historical/energy/energy.const.ts
git checkout origin/cdc -- src/app/pages/data-management/installation-data/installation-data.component.scss
git checkout origin/cdc -- src/app/pages/realtime/temp-dash/temp-dash.component.scss
git checkout origin/cdc -- src/app/shared/slide-out/slide-out.component.scss
git checkout origin/cdc -- src/app/pages/pages.component.html
git checkout origin/cdc -- src/app/pages/realtime/energy-dash/zone/zone.component.scss
git checkout origin/cdc -- src/app/pages/realtime/energy-dash/zone/zone.cont.ts
  
    ## routing
git checkout origin/tricity -- src/app/pages/pages-menu.ts
git checkout origin/tricity -- src/app/pages/pages-routing.module.ts
git checkout origin/tricity -- src/app/pages/sub-accounts/sub-accounts-routing.module.ts
git checkout origin/tricity -- src/app/pages/report/report-routing.module.ts
git checkout origin/tricity -- src/app/pages/realtime/realtime-routing.module.ts
git checkout origin/tricity -- src/app/pages/historical/historical-routing.module.ts
git checkout origin/tricity -- src/app/pages/divers/divers-routing.module.ts
git checkout origin/tricity -- src/app/pages/data-management/data-management-routing.module.ts
git checkout origin/tricity -- src/app/pages/alert/alert-routing.module.ts
git checkout origin/tricity -- src/app/pages/realtime/energy-dash/energy-dash-routing.module.ts
git checkout origin/tricity -- src/app/pages/realtime/input-dash/input-dash-routing.module.ts
git checkout origin/tricity -- src/app/pages/realtime/temp-dash/temp-dash-routing.module.ts

    ##
git checkout origin/tricity -- src/app/pages/data-management/installation-data/installation-data.component.ts
git checkout origin/tricity -- src/app/pages/data-management/installation-data/installation-data.component.html
