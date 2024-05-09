import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { IndexComponent } from "./index.component";
import { HeaderComponent } from "src/app/components/header/header.component";

@NgModule({
    declarations: [IndexComponent],
    imports: [CommonModule,
        HeaderComponent,
        RouterModule.forChild([
            { path: '', component: IndexComponent }
        ])],
    exports: [IndexComponent]
})
export class IndexModule { }