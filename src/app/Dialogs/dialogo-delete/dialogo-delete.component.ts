import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empleado } from 'src/app/interfaces/empleado';
@Component({
  selector: 'app-dialogo-delete',
  templateUrl: './dialogo-delete.component.html',
  styleUrls: ['./dialogo-delete.component.css']
})
export class DialogoDeleteComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public dataEmpleado: Empleado

  ){

  }
  ngOnInit(): void {
      
  }
  confirmar_Eliminar(){
    if(
      this.dataEmpleado
    ){
      this.dialogoReferencia.close("eliminar");
    }
  }

  
}

