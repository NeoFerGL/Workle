import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-screen',
  templateUrl: './registro-screen.component.html',
  styleUrls: ['./registro-screen.component.scss']
})
export class RegistroScreenComponent implements OnInit{
  // Varibales
  public tipo: string = "registro-usuarios";

  constructor(

  ){}

  ngOnInit(): void {
    
  }
}
