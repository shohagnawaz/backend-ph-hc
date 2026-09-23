import { 
    IQueryParams, 
    PrismaCountArgs, 
    PrismaFindManyArgs, 
    PrismaModelDelegate, 
    PrismaNumberFilter, 
    PrismaStringFilter,
    PrismaWhereConditions
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
                // direct field
                const stringFilter : PrismaStringFilter = {
                    contains : searchTerm,
                    mode : "insensitive" as const 
                }

                return {
                    [field] : stringFilter
                }
            })

            const whereConditions = this.query.where as PrismaWhereConditions
            whereConditions.OR = searchConditions;

            const countWhereConditions = this.countQuery.where as PrismaWhereConditions;
            countWhereConditions.OR = searchConditions;
        }

        return this;
    }

    filter() : this {

        const { filterableFields } = this.config;
        const excludeField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "includes"];

        const filterParams : Record<string, unknown> = {};

        Object.keys(this.queryParams).forEach(key => {
            if (!excludeField.includes(key)) {
                filterParams[key] = this.queryParams[key];
            }
        })

        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.countQuery.where as Record<string, unknown>;

        Object.keys(filterParams).forEach(key => {
            const value = filterParams[key];

            if (value === undefined || value === "") {
                return;
            };

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);

            if (!isAllowedField) {
                return;
            };
        
            if (key.includes(".")) {
                const parts = key.split(".");

                if (filterableFields && !filterableFields.includes(key)) {
                    return;
                }

                if (parts.length === 2) {
                    const [relation, nestedField] = parts;

                    queryWhere[relation] = {
                        [nestedField] : value
                    }

                    countQueryWhere[relation] = {
                        [nestedField] : value
                    }
                }
                else if (parts.length === 3) {
                    const [relation, nestedRelation, nestedField] = parts;

                    queryWhere[relation] = {
                        [nestedRelation] : {
                            [nestedField] : value
                        }
                    }

                    countQueryWhere[relation] = {
                        [nestedRelation] : {
                            [nestedField] : value
                        }
                    }
                }
                else {
                    queryWhere[key] = value;
                    countQueryWhere[key] = value;
                }
            }

            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                queryWhere[key] = this.parseFilterValue(value);
                countQueryWhere[key] = this.parseFilterValue(value);
                return;
            }
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        })
        return this;
    }

    private parseFilterValue(value : unknown) : unknown {
        if (value === "true") {
            return true;
        }
        if (value === "false") {
            return false
        }
        if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
            return Number(value);
        }
        if (Array.isArray(value)) {
            return { in : value.map(item => this.parseFilterValue(item))}
        }

        return value;
    }

    private parseRangeFilter(value : Record<string, string | number>) : PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {
        const rangeQuery : Record<string, string | number | (string | number[])> = {};
        Object.keys(value).forEach(operator) => {
            const operatorValue = value[operator];

            const parseValue : string | number = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : 
            operatorValue;

            switch(operator) {
                case "lt":
                case "lte":
                case "gt":
                case "gte":
                case "equals":
                case "not":
                case "contains":
                case "startsWith":
                case "endsWith":
                    rangeQuery.lt = parseValue;
                    break;
                    
                case "in":
                case "notIn":
                    if (Array.isArray(operatorValue)) {
                        rangeQuery[operator] = operatorValue 
                    }
                    else {
                        rangeQuery[operator] = [parsedValue];
                    }
                    break;
                default:
                    break;
            }
        }
        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
    }
}