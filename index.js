
import csvparser from "csv-parser"
import { readFileSync } from 'fs'
import {table} from './tablelate.js'
import pkg from 'prompt-sync';
const {prompt} = pkg;

//import date formatter     3
//import prompt

class account{
    #id
    #balance
    #name
    #transactionslist
    constructor(Name){
        this.#name = Name
        this.#balance = 0
        this.#transactionslist = Array()
        //this.#id =  use math class to make random id
    }

    set NextTransaction(transaction)
        {this.#transactionslist.push(transaction)}
    
    get transactions()
        {return this.#transactionslist}

    get name()
        {return this.#name}

    get balance()
        {return this.#balance} 

    CalculateBalance(){
        this.#balance = 0
        for (let each in this.#transactionslist){
            
            let transaction = this.#transactionslist[each]
            
            if (this.#name === transaction.sender){
                this.#balance -= Number(transaction.amount)
                }
            else
            //if (this.#name === transaction.sender) redundant line
                {this.#balance += Number(transaction.amount)}
        }
        this.#balance = this.#balance.toFixed(2)
        return this.#balance //returning is optional
    }

}

class transaction{
    #Date
    #From
    #To
    #Narrative
    #Amount
    constructor(date,from,to,narrative,amount){
        this.#Date      = date
        this.#From      = from
        this.#To        = to
        this.#Narrative = narrative
        this.#Amount    = amount
    }

    toString(){return `${this.#Date}, ${this.#From}, ${this.#To}, ${this.#Narrative}, ${this.#Amount}`}

    get purpose()
        {return this.#Narrative}

    get date()
        {return this.#Date}

    get sender()
        {return this.#From}

    get recipient()
        {return this.#To}

    get amount()
        {return this.#Amount}

}

function ListAccounts(accounts){
    let AccountsTable = []
    for (let each in accounts){
        AccountsTable.push({Name:    accounts[each].name,
                            Balance: `£ ${accounts[each].balance}`})

    }
    table(AccountsTable)
}

function ListTransactions(AccountName, accounts){

    for (let each in accounts){

        if (accounts[each].name === String(AccountName))
            {var SelectedAccount = accounts[each]; break}
    }
    
    let TransactionTableS = []
    let TransactionTableR = []
    for (let each in SelectedAccount.transactions){
        let CurrentTransaction = SelectedAccount.transactions[each]
        if (String(CurrentTransaction.sender)===AccountName)
            {TransactionTableS.push({Transaction: each,
                                Date: CurrentTransaction.date,
                                Recipient: CurrentTransaction.recipient,
                                Purpose: CurrentTransaction.purpose,               
                                Value: `£${Number(CurrentTransaction.amount).toFixed(2)}`
                                })}

        else
        //if (String(CurrentTransaction.recipient)===AccountName) redundant
            {TransactionTableR.push({Transaction: each,
                                Date: CurrentTransaction.date,
                                Sender: CurrentTransaction.sender,
                                Purpose: CurrentTransaction.purpose,
                                Value: `£${Number(CurrentTransaction.amount).toFixed(2)}`
                                })}
    }

    console.log(`${AccountName}'s Transactions\n\nSent`)
    table(TransactionTableS)
    console.log('Recieved')
    table(TransactionTableR)
 }

function FormatTransactions(){
    const data = readFileSync('Transactions2014.csv', 'utf8');
    let AllTransactions = data.split('\n')
    AllTransactions.pop()
    AllTransactions.shift()
    for (let e in AllTransactions) {//skip first line
        AllTransactions[e] = AllTransactions[e].split(',') 
        AllTransactions[e] = new transaction(AllTransactions[e][0],AllTransactions[e][1],AllTransactions[e][2],AllTransactions[e][3],AllTransactions[e][4])
        //console.log(AllTransactions[e].toString())
    }
  
    return AllTransactions
    
}

function MakeAccounts(AllTransactions){
    var Names = []
    for (let e in AllTransactions){
        if (!(Names.includes(String(AllTransactions[e].sender)))){Names.push(String(AllTransactions[e].sender))}
        if (!(Names.includes(String(AllTransactions[e].recipient)))){Names.push(String(AllTransactions[e].recipient))}
    }

    let accounts = []
    for (let e in Names){
        accounts[e] = new account(Names[e])
        //console.log(accounts[e].name)
    }
    return accounts
}

function AccountsTransactionsSync(AllTransactions, accounts){ 

    for (let e in AllTransactions){ //add the transaction to the sender and recipient accounts
        for (let i in accounts)
            {if (accounts[i].name === String(AllTransactions[e].sender))
                {accounts[i].NextTransaction = AllTransactions[e]; break}
            }

        for (let i in accounts)    
            {if (accounts[i].name === String(AllTransactions[e].recipient))
                {accounts[i].NextTransaction = AllTransactions[e]; break}
            }       
    }

    //for (let e in accounts){console.log(accounts[e].name); for (let i in accounts[e].transactions){console.log(accounts[e].transactions[i].toString())}}
    
}

function TakeCommand(){
    let Inp = false
    do {
    //CommandWords = pkg('Type command into console')
        let CommandWords = '  List todd' //for testing
        CommandWords = CommandWords.split(' ')
        let i = 0
        var temp = []
        CommandWords.forEach((word)=>{if (!(word === '')){temp.push(word)}})
        CommandWords = temp
        if (CommandWords[0].toUpperCase() === 'LIST'){
            var AllTransactions = FormatTransactions()
            var accounts = MakeAccounts(AllTransactions)
            AccountsTransactionsSync(AllTransactions, accounts)
            if (CommandWords[1].toUpperCase() === 'ALL'){
                for (let i in accounts){
                    accounts[i].CalculateBalance()
                }
                ListAccounts(accountsaccounts[each].name, accounts)
                Inp = true          
            }
            else {
                for (let each in accounts){
                    if (CommandWords.slice(1,CommandWords.length).join(' ').toUpperCase() === accounts[each].name.toUpperCase()){
                        ListTransactions(accounts[each].name, accounts)
                        Inp = true
                    }
                    if (!Inp){console.error(`Invalid Selection\nPlease type \n\t'List All'\nor\t'List {Valid Account Name}'`)}
                }
            }
        }
        else {console.error('Invalid Command')}

    }
    while(!Inp)
    
}

// let AllTransactions = FormatTransactions()

// let accounts = MakeAccounts(AllTransactions)

// AccountsTransactionsSync(AllTransactions, accounts)

// for (let i in accounts){
//     accounts[i].CalculateBalance()

TakeCommand()