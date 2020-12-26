import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "./pages/categories/shared/category.model";

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            {id: 1, name: "Moradia", description: "Pagamentos de contas da casa"},
            {id: 2, name: "Saude", description: "Plano de Saude e Remedios"},
            {id: 3, name: "Lazer", description: "Cinema, Parques, etc"},
            {id: 4, name: "Salario", description: "Recebimento de salario"},
            {id: 5, name: "Freelas", description: "Trabalhos com freelancer"}
        ];
        return { categories };
    }
}

