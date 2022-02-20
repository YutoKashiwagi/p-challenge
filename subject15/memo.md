## 1996年に3回以上注文したCustomerのIDと、注文回数

```SQL
SELECT
    CustomerID,
    COUNT(OrderID) as OrderCount 
FROM
    Orders 
WHERE
    OrderDate >= '1996-01-01' 
    AND OrderDate <= '1996-12-31' 
GROUP BY
    CustomerID 
HAVING
    OrderCount >= 3 
ORDER BY
    OrderCount DESC;
```

最もよく注文してくれたCustomer(CustomerID)
- 65, 63

## 過去最も多くのOrderDetailが紐づいたOrder

- OrderID: 10406
- OrderDetailCount: 5

```SQL
select
    o.OrderID,
    COUNT(d.OrderDetailID) as OrderDetailCount 
from
    Orders as o 
join
    OrderDetails as d 
        on o.OrderID = d.OrderID 
group by
    o.OrderID 
order by
    OrderDetailCount DESC limit 1;
```

## 過去最も多くのOrderが紐づいたShipper

- ShipperID: 2
- OrderCount: 74

```SQL
select
    s.ShipperID,
    count(o.ShipperID) as OrderCount 
from
    Shippers s 
join
    Orders o 
        on s.ShipperID = o.ShipperID 
group by
    s.ShipperID 
order by
    OrderCount DESC limit 1;
```

## 売上が高い順番にCountryを並べる

- Countryごとの売り上げ
```SQL
select
    Customers.Country,
    sum(EachCustomerSalesAmounts.SalesAmounts) as SalesAmounts 
from
    Customers 
join
    (
        select
            Orders.CustomerID,
            sum(OrderSaleses.SalesAmounts) as SalesAmounts
        from
            Orders 
        join
            (
                select
                    OrderID,
                    SUM(OrderDetails.Quantity * Products.Price) as SalesAmounts
                from
                    OrderDetails 
                join
                    Products 
                        on OrderDetails.ProductID = Products.ProductID 
                group by
                    OrderDetails.OrderID
            ) as OrderSaleses -- OrderIDと売り上げテーブル
                on Orders.OrderID = OrderSaleses.OrderID 
        group by
            Orders.CustomerID 
        order by
            SalesAmounts) as EachCustomerSalesAmounts -- Customerごとの売り上げテーブル
                on Customers.CustomerID = EachCustomerSalesAmounts.CustomerID 
        group by
            Customers.Country 
        order by
            SalesAmounts desc;
```

## 国ごとの売上を年毎に（1月1日~12月31日の間隔で）

```SQL
select
    Customers.Country,
    SalesAmountsByYears.OrderYear,
    SUM(SalesAmountsByYears.SalesAmount) as SalesAmount 
from
    Customers 
join
    (
        select
            Orders.CustomerID,
            strftime('%Y',
            Orders.OrderDate) as OrderYear,
            SUM(SalesAmounts.SalesAmount) as SalesAmount   
        from
            Orders   
        join
            (
                select
                    OrderDetails.OrderID,
                    OrderDetails.Quantity * Products.Price as SalesAmount 
                from
                    OrderDetails 
                join
                    Products 
                        on OrderDetails.ProductID = Products.ProductID
                ) as SalesAmounts   
                    on Orders.OrderID = SalesAmounts.OrderID   
            group by
                Orders.CustomerID,
                OrderYear ) as SalesAmountsByYears 
                    on Customers.CustomerID = SalesAmountsByYears.CustomerID 
            group by
                Customers.Country,
                SalesAmountsByYears.OrderYear;
```

## Juniorカラムの追加

カラム追加
```SQL
alter table employees
add junior bool default false;
```

データ更新sql
```SQL
update Employees set Junior = true where BirthDate >= '1960-01-01';
```

## 常連の運送業者の特定

カラム追加
```SQL
alter table Shippers
add LongRelation bool default false
```

データ更新sql
```SQL
update Shippers set LongRelation = true where ShipperID in (select ShipperID from Orders group by ShipperID having count(OrderID) >= 70);
```

## 各Employeeが最後に担当したOrder

```SQL
select EmployeeID, OrderID, MAX(OrderDate) as LatestOrderDate from Orders group by EmployeeID;
```

## NULLの扱い

- Customerテーブルで任意の１レコードのCustomerNameをNULLにする
```SQL
update Customers set CustomerName = null where CustomerID = 1;
```

- CustomerNameが存在するユーザを取得する
```SQL
select * from Customers where CustomerName is not null;
```

- CustomerNameが存在しない（NULLの）ユーザを取得
```SQL
select * from Customers where CustomerName is null;
```

- `SELECT * FROM Customers WHERE CustomerName = NULL`が使えないわけ
  - SQLにおけるnullは値が不明という意味であるため、他の値と同様に値の比較ができない

## JOINの扱い
- EmployeeId=1の従業員のレコードを、Employeeテーブルから削除してください
```SQL
delete from Employees where EmployeeID = 1;
```

- OrdersとEmployeesをJOINして、注文と担当者を取得
  - （削除された）EmloyeeId=1が担当したOrdersを表示しないクエリ
    - `select Orders.*, Employees.* from Orders natural inner join Employees;`
  - （削除された）EmloyeeId=1が担当したOrdersを表示する（Employeesに関する情報はNULLで埋まる）クエリ
    - `select Orders.*, Employees.* from Orders natural left outer join Employees;`

## GROUP BYした上で絞り込みを行う際の「WHERE」と「HAVING」の違い

WHEREはグループ化前のテーブルの行、Havingはグループを対象に絞り込みを行う

なのでグループ化前にデータを絞りこんでおきたい時はWHEREを使い、グループに対して絞り込みを行いたい時はHAVINGを使う

## DDL、DML、DCL、TCL

[参考](https://www.geeksforgeeks.org/sql-ddl-dql-dml-dcl-tcl-commands/)

- DDL(Data Definition Language)
  - DBの構造を定義、修正するSQLコマンド

- DML(Data Manipulation Language)
  - データを操作するSQLコマンド。ほとんどのSQLがこのDMLに該当する

- DCL(Data Control Language)
  - DBの認可を制御するSQLコマンド

- TCL(Transaction Control Language)
  - commit, rollbackなど、トランザクションを制御する

## クイズ

- with句のメリット、デメリットを教えてください
- 相関サブクエリを説明してください
- window関数における、ウィンドウフレームを説明してください
