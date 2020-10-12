export class Cliente
{
  id: number;
  email: string;
  password: string;
  nombre: string;
  type: string = "USUARIO";
}

export class Restaurante
{
  id: number;
  email: string;
  password: string;
  nombre_comercio: string;
  rif: number;
  descripcion: string;
  type: string = "RESTAURANTE";
}