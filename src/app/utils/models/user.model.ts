export class Cliente
{
  email: string;
  password: string;
  nombre: string;
  id: number;
  type: string = "CLIENTE";
}

export class Restaurante
{
  email: string;
  password: string;
  rif: string;
  nombre_comercio: string;
  id: number;
  type: string = "RESTAURANTE";
}