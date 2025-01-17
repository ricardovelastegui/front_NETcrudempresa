import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, Validator, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment'; 
import {MatGridListModule} from '@angular/material/grid-list';
import { Empleado } from 'src/app/interfaces/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Departamento } from 'src/app/interfaces/departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';

export const MY_DATE_FORMATS = {
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY',
    dateA11yLabel:'LL',
    monthYearA11yLabel:'MMMM YYYY'

  }
}

@Component({
  selector: 'app-dialog-add-edit',
  templateUrl: './dialog-add-edit.component.html',
  styleUrls: ['./dialog-add-edit.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS}
  ]
})
export class DialogAddEditComponent implements OnInit {

  formEmpleado: FormGroup;
  tituloAccion: string="Nuevo";
  botonAccion: string= "Guardar";
  listaDepartamentos: Departamento[]=[]

  constructor(
    private dialogoReferencia: MatDialogRef<DialogAddEditComponent>,
    private fb : FormBuilder,
    private _snackBar: MatSnackBar,
    private _departamentoServicio: DepartamentoService,
    private _empleadoServicio: EmpleadoService,
    @Inject(MAT_DIALOG_DATA) public dataEmpleado: Empleado
  ){
    this.formEmpleado = this.fb.group({
      nombreEmp:['', Validators.required],
      apellido:['', Validators.required],
      idDepartamento:['', Validators.required],
      sueldo:['', Validators.required],
      fechaContrato:['', Validators.required]
    });


    this._departamentoServicio.getList().subscribe({
      next:(data) => {
        this.listaDepartamentos = data;
      },error:(e) => {}
    }) 
  }

  mostrarAlerta(msg: string, accion: string) {
    this._snackBar.open(msg, accion,{
      horizontalPosition:"end",
      verticalPosition:"top",
      duration:3000
    });
  }

  addEditEmpleado(){
    console.log(this.formEmpleado.value)
    const modelo: Empleado ={
      idEmpleado:0,
      nombreEmp:this.formEmpleado.value.nombreEmp,
      apellido: this.formEmpleado.value.apellido,
      idDepartamento: this.formEmpleado.value.idDepartamento,
      sueldo: this.formEmpleado.value.sueldo,
      fechaContrato: moment(this.formEmpleado.value.fechaContrato).format("DD/MM/YYYY"),
      nombreDepartamento: ""
    }

    if(this.dataEmpleado==null){
      this._empleadoServicio.add(modelo).subscribe({
        next:(data) => {
          this.mostrarAlerta("Empleado guardado correctamente", "Listo");
          this.dialogoReferencia.close("creado");
        }, error:(e) => {
          this.mostrarAlerta("No se puede crear", "Error");
        }
      })
    } else{
      this._empleadoServicio.update(this.dataEmpleado.idEmpleado,modelo).subscribe({
        next:(data) => {
          this.mostrarAlerta("Empleado editado correctamente", "Listo");
          this.dialogoReferencia.close("editado");
        }, error:(e) => {
          this.mostrarAlerta("No se puede crear", "Error");
        }
      })
    }
    
  }

  ngOnInit(): void {
      if(this.dataEmpleado){
        this.formEmpleado.patchValue({
          nombreEmp: this.dataEmpleado.nombreEmp,
          apellido: this.dataEmpleado.apellido,
          idDepartamento: this.dataEmpleado.idDepartamento,
          sueldo: this.dataEmpleado.sueldo,
          fechaContrato: moment(this.dataEmpleado.fechaContrato, 'DD/MM/YYYY') 
        })

        this.tituloAccion = "Editar";
        this.botonAccion = "Actualizar";
      }
  }


}
