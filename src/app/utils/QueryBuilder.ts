import { 
    IQueryParams, 
    PrismaCountArgs, 
    PrismaFindManyArgs, 
    PrismaModelDelegate, 
    PrismaStringFilter
} from "../interfaces/query.interface"

// T = Model Type
export class QueryBuilder<
T,
TWhereInput = Record<string, unknown>,
TInclude = Record<string, unknown>
> {
    private query : PrismaFindManyArgs;
    private countQuery: PrismaCountArgs;
    private page : number = 1;
    private limit : number = 10;
    private skip : number = 0;
    private sortBy : string = "createdAt";
    private sortOrder : "asc" | "desc" = "desc";
    private selectFields : Record<string, boolean | undefined>;


    constructor(
        private model : PrismaModelDelegate,
        private queryParams : IQueryParams,
        private config : IQueryParams
    ){
        this.query = {
            where : {},
            include : {},
            orderBy : {},
            skip : 0,
            take: 10
        };

        this.countQuery = {
            where: {}
        }
    }

    search() : this {
        const {searchTerm} = this.queryParams;
        const {searchableFields} = this.config;
        if (searchTerm && searchableFields && searchableFields.length > 0) {
            const searchConditions : Record<string, unknown>[] =
            searchableFields.map((field) => {
                if (field.includes(".")) {
                    const parts = field.split(".");

                    if (parts.length === 2) {
                        const [relation, nestedField] = parts;

                        const stringFilter : PrismaStringFilter = {
                            contains : searchTerm,
                            mode: "insensitive" as const
                        }
                        
                        return {
                            [relation] : {
                                [nestedField] : stringFilter
                            }
                        } 
                    }
                    else if (parts.length === 3) {
                        const [relation, nestedRelation, nestedField] = parts;

                        const stringFilter : PrismaStringFilter = {
                            contains : searchTerm,
                            mode: "insensitive" as const
                        }

                        return {
                            [relation] : {
                                [nestedRelation] : {
                                    [nestedField] : stringFilter
                                }
                            }
                        }
                    }
                }
            })
        }
    }
}