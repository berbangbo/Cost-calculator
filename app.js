const M=document.getElementById('materials');
const money=n=>'฿'+Number(n||0).toLocaleString('th-TH',{minimumFractionDigits:2,maximumFractionDigits:2});

function addMaterial(){
 const el=document.createElement('div');
 el.className='material';
 el.innerHTML=`
 <div class="grid">
  <label>วัสดุ<input class="name" placeholder="เช่น เหล็กกล่อง 1x1"></label>
  <label>วิธีคิด<select class="type">
   <option value="piece">ต่อชิ้น / หน่วย</option>
   <option value="length">ต่อเมตร</option>
   <option value="area">ตามพื้นที่</option>
  </select></label>
  <label>ราคาซื้อ<input class="price" type="number" min="0" placeholder="บาท"></label>
 </div>
 <div class="grid3">
  <label class="size1-label">ความยาวที่ซื้อ (ม.)<input class="s1" type="number" min="0"></label>
  <label class="size2-label">ยาวที่ซื้อ (ซม.)<input class="s2" type="number" min="0"></label>
  <label>ใช้ไป<input class="qty" type="number" min="0" step="0.01" placeholder="จำนวน"></label>
 </div>
 <div class="costline"><span>ต้นทุนรายการนี้</span><span class="cost">฿0.00</span></div>
 <div style="text-align:right"><button type="button" class="del">ลบวัสดุ</button></div>`;
 M.appendChild(el);

 el.querySelectorAll('input,select').forEach(x=>x.addEventListener('input',calc));
 el.querySelector('.del').addEventListener('click',()=>{el.remove();calc()});
 el.querySelector('.type').addEventListener('change',()=>{updateLabels(el);calc()});
 updateLabels(el);
}

function updateLabels(el){
 const t=el.querySelector('.type').value;
 const l1=el.querySelector('.size1-label'), l2=el.querySelector('.size2-label');
 if(t==='length'){
   l1.firstChild.textContent='ความยาวที่ซื้อ (ม.)';
   l2.style.display='none';
 }else if(t==='area'){
   l1.firstChild.textContent='กว้างที่ซื้อ (ซม.)';
   l2.firstChild.textContent='ยาวที่ซื้อ (ซม.)';
   l2.style.display='block';
 }else{
   l1.firstChild.textContent='ขนาดอ้างอิง (ถ้ามี)';
   l2.style.display='none';
 }
}

function calc(){
 let mat=0;
 M.querySelectorAll('.material').forEach(el=>{
   const p=+el.querySelector('.price').value||0;
   const q=+el.querySelector('.qty').value||0;
   const t=el.querySelector('.type').value;
   const s1=+el.querySelector('.s1').value||0;
   const s2=+el.querySelector('.s2').value||0;
   let c=0;
   if(t==='piece') c=p*q;
   if(t==='length') c=s1>0 ? p*(q/s1) : 0;
   if(t==='area') c=(s1>0&&s2>0) ? p*(q/(s1*s2)) : 0;
   el.querySelector('.cost').textContent=money(c);
   mat+=c;
 });
 const lab=+document.getElementById('labor').value||0;
 const sell=+document.getElementById('selling').value||0;
 document.getElementById('mat').textContent=money(mat);
 document.getElementById('lab').textContent=money(lab);
 document.getElementById('total').textContent=money(mat+lab);
 document.getElementById('profit').textContent=money(sell-mat-lab);
}

document.getElementById('add').addEventListener('click',addMaterial);
document.getElementById('labor').addEventListener('input',calc);
document.getElementById('selling').addEventListener('input',calc);
document.getElementById('difficulty').addEventListener('change',e=>{
 const base=[0,100,200,300,400,500];
 document.getElementById('labor').value=base[+e.target.value];
 calc();
});
addMaterial(); addMaterial(); calc();
// ===== PRINT / SAVE PDF =====

const pdfBtn = document.createElement('button');

pdfBtn.type = 'button';
pdfBtn.textContent = '📄 บันทึกเป็น PDF';
pdfBtn.style.marginTop = '10px';

document.body.appendChild(pdfBtn);

pdfBtn.addEventListener('click', () => {

  // ทำให้ค่าที่กรอกในช่องต่าง ๆ ติดไปตอนพิมพ์ PDF
  document.querySelectorAll('input').forEach(input => {
    input.setAttribute('value', input.value);
  });

  // ทำให้ค่าที่เลือกในช่อง Select ติดไปตอนพิมพ์ PDF
  document.querySelectorAll('select').forEach(select => {

    select.querySelectorAll('option').forEach(option => {
      option.removeAttribute('selected');
    });

    const selected = select.querySelector(
      `option[value="${select.value}"]`
    );

    if (selected) {
      selected.setAttribute('selected', '');
    }
  });

  window.print();
});
