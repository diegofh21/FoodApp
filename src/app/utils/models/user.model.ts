export class Cliente
{
  email: string;
  password: string;
  nombre: string;
  type: string = "CLIENTE";
}

export class Restaurante
{
  email: string;
  password: string;
  rif: string;
  nombre_comercio: string;
  type: string = "RESTAURANTE";
}