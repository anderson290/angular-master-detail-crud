import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "./pages/categories/shared/category.model";
import { Entry } from "./pages/entries/shared/entry.model";

export class InMemoryDatabase implements InMemoryDbService {
    createDb() {
        const categories: Category[] = [
            {id: 1, name: "Moradia", description: "Pagamentos de contas da casa"},
            {id: 2, name: "Saude", description: "Plano de Saude e Remedios"},
            {id: 3, name: "Lazer", description: "Cinema, Parques, etc"},
            {id: 4, name: "Salario", description: "Recebimento de salario"},
            {id: 5, name: "Freelas", description: "Trabalhos com freelancer"}
        ];

        const entries: Entry[] = [
            { id: 1, name: 'Gás de Cozinha', categoryId: categories[0].id, category: categories[0], paid: true, date: "26/12/2020", amount: "70,80", type: "expense" } as Entry,
            { id: 2, name: 'Suplementos', categoryId: categories[1].id, category: categories[1], paid: false, date: "26/12/2020", amount: "15,30", type: "expense" } as Entry,
        ];

        return { categories, entries };
    }
}

